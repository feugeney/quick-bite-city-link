
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Clock, ChefHat, Truck, CheckCircle, MapPin, Phone, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  status: string;
  total_price: number;
  delivery_address: string;
  created_at: string;
  restaurants: {
    name: string;
  };
  order_items: {
    quantity: number;
    dishes: {
      name: string;
    };
  }[];
}

const ModernOrderTracker = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          total_price,
          delivery_address,
          created_at,
          restaurants (
            name
          ),
          order_items (
            quantity,
            dishes (
              name
            )
          )
        `)
        .eq('user_id', user?.id)
        .in('status', ['pending', 'preparing', 'ready', 'out_for_delivery'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          text: 'Commande reçue',
          color: 'text-orange-600 bg-orange-50 border-orange-200',
          dotColor: 'bg-orange-500',
          progress: 25
        };
      case 'preparing':
        return {
          icon: ChefHat,
          text: 'En préparation',
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          dotColor: 'bg-blue-500',
          progress: 50
        };
      case 'ready':
        return {
          icon: Package,
          text: 'Prête pour livraison',
          color: 'text-purple-600 bg-purple-50 border-purple-200',
          dotColor: 'bg-purple-500',
          progress: 75
        };
      case 'out_for_delivery':
        return {
          icon: Truck,
          text: 'En cours de livraison',
          color: 'text-green-600 bg-green-50 border-green-200',
          dotColor: 'bg-green-500',
          progress: 90
        };
      case 'delivered':
        return {
          icon: CheckCircle,
          text: 'Livrée',
          color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
          dotColor: 'bg-emerald-500',
          progress: 100
        };
      default:
        return {
          icon: Clock,
          text: status,
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          dotColor: 'bg-gray-500',
          progress: 0
        };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse rounded-2xl">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded-lg w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded-full w-32"></div>
              </div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-16 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucune commande en cours</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Vous n'avez pas de commande active pour le moment. Découvrez nos restaurants partenaires et passez votre première commande !</p>
          <Button 
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={() => navigate('/nearby')}
          >
            <Package className="h-5 w-5 mr-2" />
            Découvrir les restaurants
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const statusInfo = getStatusInfo(order.status);
        const StatusIcon = statusInfo.icon;

        return (
          <Card key={order.id} className="overflow-hidden rounded-2xl shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0">
              {/* En-tête moderne */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Commande #{order.id.slice(-8)}
                      </h3>
                      <p className="text-gray-600 font-medium">{order.restaurants.name}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${statusInfo.color}`}>
                    <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor} animate-pulse`}></div>
                    <StatusIcon className="h-4 w-4" />
                    <span className="text-sm font-semibold">{statusInfo.text}</span>
                  </div>
                </div>

                {/* Barre de progression moderne */}
                <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-1000 ease-out rounded-full relative"
                    style={{ width: `${statusInfo.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Commande passée</span>
                  <span className="font-semibold text-green-600">{statusInfo.progress}% terminé</span>
                </div>
              </div>

              {/* Contenu principal */}
              <div className="p-6 space-y-6">
                {/* Articles commandés */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-gray-600" />
                    Articles commandés ({order.order_items.length})
                  </h4>
                  <div className="space-y-3">
                    {order.order_items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-bold text-sm">{item.quantity}</span>
                          </div>
                          <span className="font-medium text-gray-800">{item.dishes.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Informations de livraison */}
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">Adresse de livraison</h4>
                      <p className="text-gray-700">{order.delivery_address}</p>
                      <p className="text-sm text-blue-600 mt-2">
                        📅 Commandé le {new Date(order.created_at).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions et total */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                    <span className="text-lg font-bold text-green-800">
                      Total: {order.total_price} GNF
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="rounded-lg border-gray-200 hover:border-green-500 hover:text-green-600">
                      <Phone className="h-4 w-4 mr-2" />
                      Contacter
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-lg border-gray-200 hover:border-blue-500 hover:text-blue-600">
                      <Eye className="h-4 w-4 mr-2" />
                      Suivre
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ModernOrderTracker;
