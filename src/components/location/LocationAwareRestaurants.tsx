
import { useState, useEffect } from 'react';
import { useAutoLocation } from '@/hooks/useAutoLocation';
import RestaurantCard from '@/components/RestaurantCard';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Restaurant = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  image_url: string | null;
  phone: string | null;
  opening_hours: any;
  coordinates: any;
  created_at: string;
};

const LocationAwareRestaurants = () => {
  const { location, loading: locationLoading, error: locationError, refreshLocation } = useAutoLocation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Toujours charger tous les restaurants sans filtrage par distance
    fetchAllRestaurants();
  }, []);

  const fetchAllRestaurants = async () => {
    try {
      setLoading(true);
      console.log('Récupération de tous les restaurants...');
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Restaurants récupérés:', data);
      setRestaurants(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des restaurants:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les restaurants.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-500" />
          <p className="text-gray-600">Chargement des restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section localisation */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Votre localisation
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshLocation}
            disabled={locationLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${locationLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {locationLoading && (
          <div className="flex items-center gap-2 text-gray-600">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Détection de votre position...</span>
          </div>
        )}

        {locationError && (
          <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Position non disponible</p>
              <p className="text-sm text-yellow-700">{locationError}</p>
            </div>
          </div>
        )}

        {location && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              <strong>Position détectée:</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
            <p className="text-sm text-green-700 mt-1">
              Affichage de tous les restaurants disponibles à Conakry
            </p>
          </div>
        )}

        {!location && !locationLoading && !locationError && (
          <div className="text-gray-600">
            <p>Aucune position détectée. Affichage de tous les restaurants disponibles.</p>
          </div>
        )}
      </div>

      {/* Liste des restaurants */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Tous les restaurants disponibles
          </h2>
          <span className="text-sm text-gray-500">
            {restaurants.length} restaurant{restaurants.length > 1 ? 's' : ''} trouvé{restaurants.length > 1 ? 's' : ''}
          </span>
        </div>

        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={{
                  id: restaurant.id,
                  name: restaurant.name,
                  description: restaurant.description || '',
                  image_url: restaurant.image_url || '/placeholder.svg',
                  address: restaurant.address,
                  phone: restaurant.phone || ''
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun restaurant trouvé
              </h3>
              <p className="text-gray-600">
                Il n'y a actuellement aucun restaurant disponible dans votre zone.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationAwareRestaurants;
