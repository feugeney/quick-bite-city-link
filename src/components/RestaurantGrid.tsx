
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import RestaurantCard from './RestaurantCard';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  image_url: string;
  address: string;
  phone: string;
}

const RestaurantGrid = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('id, name, description, image_url, address, phone')
          .limit(6);

        if (error) {
          console.error('Error fetching restaurants:', error);
          return;
        }

        setRestaurants(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Restaurants populaires</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les meilleurs restaurants de Conakry
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-64"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Restaurants populaires</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les meilleurs restaurants de Conakry
          </p>
        </div>
        
        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun restaurant disponible pour le moment.</p>
            <p className="text-gray-400 mt-2">Les restaurants seront bientôt disponibles !</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RestaurantGrid;
