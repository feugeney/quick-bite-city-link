
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RestaurantHero from '@/components/restaurant/RestaurantHero';
import RestaurantInfo from '@/components/restaurant/RestaurantInfo';
import RestaurantMenu from '@/components/restaurant/RestaurantMenu';
import CartSection from '@/components/restaurant/CartSection';

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string | null;
  image_url: string | null;
  // Add properties needed by RestaurantHero component
  image: string;
  rating: number;
  reviewCount: number;
  distance: string;
  deliveryTime: string;
  // Add property needed by RestaurantInfo component
  openingHours: string;
}

const RestaurantMenuPage = () => {
  const { id } = useParams<{ id: string }>();
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
        
        // Transform database data to match the Restaurant interface
        if (data) {
          const restaurantWithDisplayProps: Restaurant = {
            ...data,
            image: data.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            rating: 4.5, // Default value or could be calculated from reviews
            reviewCount: 0, // Default value or could be fetched from reviews table
            distance: '1.0 km', // This would come from a calculation based on user location
            deliveryTime: '30-45 min', // This could be a standard value or calculated
            openingHours: data.opening_hours ? JSON.stringify(data.opening_hours) : '08:00 - 22:00'
          };
          
          setRestaurant(restaurantWithDisplayProps);
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le restaurant",
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">Restaurant non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RestaurantHero restaurant={restaurant} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <RestaurantInfo restaurant={restaurant} />
            <RestaurantMenu restaurantId={restaurant.id} />
          </div>
          
          <div className="lg:col-span-1">
            <CartSection />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantMenuPage;
