
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface AvailableOrder {
  id: string;
  total_price: number;
  delivery_address: string;
  created_at: string;
  restaurants: {
    name: string;
    address: string;
  };
  profiles: {
    first_name: string;
    last_name: string;
  };
}

export const useDeliveryDashboard = () => {
  const [availableOrders, setAvailableOrders] = useState<AvailableOrder[]>([]);
  const [currentDelivery, setCurrentDelivery] = useState<AvailableOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchAvailableOrders();
    fetchCurrentDelivery();

    if (user) {
      const channel = supabase
        .channel('delivery-orders')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          (payload) => {
            console.log('Order change detected:', payload);
            fetchAvailableOrders();
            fetchCurrentDelivery();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchAvailableOrders = async () => {
    try {
      console.log('Fetching available orders');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_price,
          delivery_address,
          created_at,
          user_id,
          restaurants!inner(name, address)
        `)
        .eq('status', 'ready')
        .is('delivery_person_id', null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const orderIds = data.map(order => order.user_id) || [];
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', orderIds);

        if (profilesError) throw profilesError;

        const ordersWithProfiles = data.map(order => ({
          ...order,
          profiles: profiles?.find(profile => profile.id === order.user_id) || 
                    { first_name: '', last_name: '' }
        }));

        setAvailableOrders(ordersWithProfiles);
      } else {
        setAvailableOrders([]);
      }
    } catch (error) {
      console.error('Error fetching available orders:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes disponibles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentDelivery = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_price,
          delivery_address,
          created_at,
          user_id,
          restaurants!inner(name, address)
        `)
        .eq('delivery_person_id', user.id)
        .eq('status', 'out_for_delivery')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', data.user_id)
          .single();

        if (profileError) throw profileError;

        setCurrentDelivery({
          ...data,
          profiles: profile
        });
      } else {
        setCurrentDelivery(null);
      }
    } catch (error) {
      console.error('Error fetching current delivery:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la livraison en cours",
        variant: "destructive",
      });
    }
  };

  const acceptOrder = async (orderId: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          delivery_person_id: user.id,
          status: 'out_for_delivery' as OrderStatus
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Commande acceptée",
        description: "Vous avez accepté cette livraison",
      });

      fetchAvailableOrders();
      fetchCurrentDelivery();
    } catch (error) {
      console.error('Error accepting order:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la commande",
        variant: "destructive",
      });
    }
  };

  const completeDelivery = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'delivered' as OrderStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Livraison terminée",
        description: "La commande a été marquée comme livrée",
      });

      setCurrentDelivery(null);
      fetchAvailableOrders();
    } catch (error) {
      console.error('Error completing delivery:', error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer la livraison",
        variant: "destructive",
      });
    }
  };

  return {
    availableOrders,
    currentDelivery,
    loading,
    acceptOrder,
    completeDelivery,
    fetchAvailableOrders,
    fetchCurrentDelivery,
  };
};
