import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Package, RefreshCw, Store } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrdersList from './OrdersList';
import { OrderStatus, isValidOrderStatus, getAllValidStatuses } from './OrderStatusUtils';
import { useOrderStatuses } from '@/hooks/useOrderStatuses';

interface Order {
  id: string;
  status: OrderStatus;
  total_price: number;
  delivery_address: string;
  created_at: string;
  notes: string | null;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
  order_items: {
    quantity: number;
    price: number;
    dishes: {
      name: string;
    };
  }[];
}

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('current');
  const { toast } = useToast();
  const { user } = useAuth();
  const { validateTransition } = useOrderStatuses();

  useEffect(() => {
    if (user) {
      fetchOrders();
      
      const channel = supabase
        .channel('restaurant-orders')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          (payload) => {
            console.log('[OrderManager] Order change detected:', payload);
            fetchOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.id) {
      console.log('[OrderManager] No user ID available');
      return;
    }
    
    try {
      console.log('[OrderManager] Fetching orders for restaurant owner:', user.id);
      
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (restaurantError) {
        console.error('[OrderManager] Restaurant fetch error:', restaurantError);
        
        if (restaurantError.code === 'PGRST116') {
          console.log('[OrderManager] No restaurant found for current user');
          setOrders([]);
          setLoading(false);
          return;
        }
        
        throw restaurantError;
      }

      if (!restaurant) {
        console.log('[OrderManager] No restaurant found for user');
        setOrders([]);
        setLoading(false);
        return;
      }

      console.log('[OrderManager] Found restaurant:', restaurant.id);

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          total_price,
          delivery_address,
          created_at,
          notes,
          user_id,
          order_items(
            quantity,
            price,
            dishes(name)
          )
        `)
        .eq('restaurant_id', restaurant.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('[OrderManager] Orders fetch error:', ordersError);
        throw ordersError;
      }
      
      console.log('[OrderManager] Fetched orders:', ordersData);

      if (ordersData && ordersData.length > 0) {
        const userIds = [...new Set(ordersData.map(order => order.user_id))];
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', userIds);

        if (profilesError) {
          console.error('[OrderManager] Profiles fetch error:', profilesError);
          throw profilesError;
        }

        const ordersWithProfiles = ordersData.map(order => ({
          ...order,
          profiles: profiles?.find(profile => profile.id === order.user_id) || 
                   { first_name: 'Client', last_name: 'Inconnu' }
        }));

        setOrders(ordersWithProfiles);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('[OrderManager] Error fetching orders:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    console.log(`[OrderManager] Starting update for order ${orderId} to status: ${newStatus}`);
    
    if (!orderId || !newStatus) {
      console.error('[OrderManager] Missing orderId or newStatus');
      toast({
        title: "Erreur",
        description: "Paramètres manquants pour la mise à jour",
        variant: "destructive",
      });
      return;
    }

    // Récupérer le statut actuel de la commande
    const currentOrder = orders.find(order => order.id === orderId);
    if (!currentOrder) {
      throw new Error('Commande non trouvée');
    }

    // Valider la transition avec la base de données
    const isValidTransition = await validateTransition(currentOrder.status, newStatus);
    if (!isValidTransition) {
      console.error(`[OrderManager] Invalid transition from ${currentOrder.status} to ${newStatus}`);
      toast({
        title: "Erreur",
        description: `Transition invalide de "${currentOrder.status}" vers "${newStatus}"`,
        variant: "destructive",
      });
      return;
    }

    setUpdatingOrder(orderId);
    
    try {
      // Mise à jour optimiste de l'interface
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));

      console.log(`[OrderManager] Updating order ${orderId} to ${newStatus} in database`);
      
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select('id, status');

      if (error) {
        console.error('[OrderManager] Supabase update error:', error);
        // Annuler la mise à jour optimiste en cas d'erreur
        fetchOrders();
        throw error;
      }

      console.log(`[OrderManager] Order ${orderId} updated successfully:`, data);

      const statusMessages: Record<OrderStatus, string> = {
        'pending': 'en attente',
        'preparing': 'en préparation',
        'ready': 'prête',
        'out_for_delivery': 'en livraison',
        'delivered': 'livrée',
        'cancelled': 'annulée'
      };

      toast({
        title: "Succès",
        description: `Commande mise à jour vers "${statusMessages[newStatus]}" avec succès`,
      });
      
      // Rafraîchir les données après un court délai
      setTimeout(() => {
        console.log('[OrderManager] Refreshing orders after successful update');
        fetchOrders();
      }, 1000);
      
    } catch (error) {
      console.error('[OrderManager] Error updating order status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande",
        variant: "destructive",
      });
      
      // Restaurer l'état précédent en cas d'erreur
      fetchOrders();
    } finally {
      setUpdatingOrder(null);
    }
  };

  const currentOrders = orders.filter(order => 
    ['pending', 'preparing', 'ready', 'out_for_delivery'].includes(order.status)
  );
  const completedOrders = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/5 to-blue-50 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-800">Gestion des commandes</CardTitle>
                <p className="text-gray-600 mt-1">Gérez vos commandes en temps réel</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setLoading(true);
                fetchOrders();
              }} 
              size="sm"
              className="bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800">En cours</p>
                <p className="text-2xl font-bold text-orange-900">{currentOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Terminées</p>
                <p className="text-2xl font-bold text-green-900">{completedOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Total</p>
                <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger value="current" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Clock className="h-4 w-4" />
            Commandes en cours ({currentOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Package className="h-4 w-4" />
            Historique ({completedOrders.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4 mt-6">
          <OrdersList
            orders={currentOrders}
            emptyMessage="Aucune commande en cours. Les nouvelles commandes apparaîtront ici."
            updatingOrder={updatingOrder}
            onUpdateStatus={updateOrderStatus}
            onRefresh={fetchOrders}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-6">
          <OrdersList
            orders={completedOrders}
            emptyMessage="Aucune commande terminée pour le moment."
            updatingOrder={updatingOrder}
            onUpdateStatus={updateOrderStatus}
            onRefresh={fetchOrders}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderManager;
