
import { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Bell } from 'lucide-react';

interface OrderRealtimeContextType {
  hasUnreadNotifications: boolean;
}

const OrderRealtimeContext = createContext<OrderRealtimeContextType>({
  hasUnreadNotifications: false
});

interface OrderRealtimeProviderProps {
  children: ReactNode;
}

export const OrderRealtimeProvider = ({ children }: OrderRealtimeProviderProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Vérifier les notifications non lues au démarrage
    const checkUnreadNotifications = async () => {
      try {
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false);
        
        if (error) throw error;
        setHasUnreadNotifications(count !== null && count > 0);
      } catch (error) {
        console.error('Error checking unread notifications:', error);
      }
    };

    checkUnreadNotifications();

    // S'abonner aux changements de commandes
    const orderChannel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change detected:', payload);
          
          // Notifications spécifiques au rôle
          if (payload.eventType === 'UPDATE') {
            const newStatus = payload.new?.status;
            
            // Pour les livreurs: notification spéciale pour les commandes prêtes
            if (newStatus === 'ready' && user.role === 'livreur') {
              toast({
                title: "Nouvelle commande disponible",
                description: "Une commande est prête à être livrée. Consultez le tableau de bord pour l'accepter.",
                duration: 10000, // Durée plus longue pour donner le temps de réagir
              });
            }
            
            // Pour les clients
            else if (user.role === 'client') {
              const statusMessages: Record<string, string> = {
                'preparing': 'Votre commande est en préparation',
                'ready': 'Votre commande est prête',
                'out_for_delivery': 'Votre commande est en cours de livraison',
                'delivered': 'Votre commande a été livrée',
                'cancelled': 'Votre commande a été annulée'
              };

              if (newStatus && statusMessages[newStatus]) {
                toast({
                  title: "Mise à jour de commande",
                  description: statusMessages[newStatus],
                });
              }
            }
            
            // Pour les restaurants
            else if (user.role === 'restaurant') {
              if (newStatus === 'out_for_delivery') {
                toast({
                  title: "Commande en livraison",
                  description: "Un livreur a pris en charge cette commande",
                });
              }
            }
          }
        }
      )
      .subscribe();

    // S'abonner aux notifications
    const notificationChannel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification:', payload);
          
          if (payload.new) {
            setHasUnreadNotifications(true);
            
            const notification = payload.new as any;
            // Remove the 'icon' property since it's not supported in the Toast type
            toast({
              title: notification.title,
              description: notification.message,
              // Instead of using the icon property, we'll append the Bell icon to the title or description if needed
              duration: 8000,
            });
          }
        }
      )
      .subscribe();

    // S'abonner aux mises à jour de notifications (marquées comme lues)
    const notificationUpdateChannel = supabase
      .channel('notification-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id} AND is_read=eq.true`
        },
        (payload) => {
          // Vérifier si toutes les notifications sont désormais lues
          checkUnreadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(notificationChannel);
      supabase.removeChannel(notificationUpdateChannel);
    };
  }, [user, toast]);

  return (
    <OrderRealtimeContext.Provider value={{ hasUnreadNotifications }}>
      {children}
    </OrderRealtimeContext.Provider>
  );
};

export const useOrderRealtime = () => {
  return useContext(OrderRealtimeContext);
};
