
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import RestaurantHero from '@/components/restaurant/RestaurantHero';
import RestaurantInfo from '@/components/restaurant/RestaurantInfo';
import RestaurantMenu from '@/components/restaurant/RestaurantMenu';
import CartSection from '@/components/restaurant/CartSection';

interface Restaurant {
  id: string;
  name: string;
  image_url?: string;
  description?: string;
  address: string;
  phone?: string;
  coordinates?: unknown;
  opening_hours?: any;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setRestaurant(data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du restaurant",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <p>Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <p>Restaurant non trouvé</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <RestaurantHero restaurant={{
        image: restaurant.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        name: restaurant.name,
        rating: 4.5,
        reviewCount: 100,
        distance: '1.2 km',
        deliveryTime: '25-35 min'
      }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2">
            <RestaurantInfo restaurant={{
              address: restaurant.address,
              phone: restaurant.phone || 'Non renseigné',
              openingHours: '10:00 - 22:00'
            }} />
            
            <RestaurantMenu restaurantId={restaurant.id} />
          </div>
          
          <div className="lg:col-span-1">
            <CartSection />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RestaurantDetail;
