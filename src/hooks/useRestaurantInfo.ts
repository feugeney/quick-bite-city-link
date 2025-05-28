
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RestaurantInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  image_url: string;
}

export const useRestaurantInfo = () => {
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchRestaurantInfo();
    }
  }, [user]);

  const fetchRestaurantInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name, description, address, phone, image_url')
        .eq('owner_id', user?.id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          throw error;
        }
        setRestaurant(null);
      } else {
        setRestaurant(data);
      }
    } catch (error) {
      console.error('Error fetching restaurant info:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations du restaurant",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { restaurant, loading, refetch: fetchRestaurantInfo };
};
