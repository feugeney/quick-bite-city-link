
import { useState, useEffect } from 'react';
import { MapPin, Navigation, CheckCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAutoLocation } from '@/hooks/useAutoLocation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const LocationTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { location, loading, error, refreshLocation } = useAutoLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (location && user) {
      updateDeliveryPersonLocation(location.lat, location.lng);
      setLastUpdated(new Date());
    }
  }, [location, user]);

  useEffect(() => {
    // Si le tracking est activé, mettre à jour la position périodiquement
    let interval: number | undefined;
    
    if (isTracking && navigator.geolocation) {
      interval = window.setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude: lat, longitude: lng } = position.coords;
            updateDeliveryPersonLocation(lat, lng);
            setLastUpdated(new Date());
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }, 30000); // Mise à jour toutes les 30 secondes
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const updateDeliveryPersonLocation = async (lat: number, lng: number) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase.rpc('update_delivery_location', {
        user_id: user.id,
        latitude: lat,
        longitude: lng
      });

      if (error && error.code === '42883') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            current_latitude: lat,
            current_longitude: lng,
            last_updated_position: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) throw updateError;
      } else if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const toggleTracking = () => {
    setIsTracking(prev => !prev);
    if (!isTracking) {
      toast({
        title: "Suivi activé",
        description: "Votre position sera mise à jour automatiquement",
      });
    } else {
      toast({
        title: "Suivi désactivé",
        description: "Mise à jour de position arrêtée",
      });
    }
  };

  return (
    <Card className="border-primary/20 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center gap-2 text-primary">
          <MapPin className="h-5 w-5" />
          Ma position
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Button 
            onClick={refreshLocation}
            variant="outline"
            disabled={loading}
            className="w-full md:w-auto transition-all duration-300"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Localisation...
              </>
            ) : (
              <>
                <Navigation className="mr-2 h-4 w-4" />
                Actualiser position
              </>
            )}
          </Button>
          
          <Button 
            onClick={toggleTracking}
            variant={isTracking ? "destructive" : "default"}
            className="w-full md:w-auto transition-all duration-300"
            disabled={!location}
          >
            {isTracking ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Suivi actif
              </>
            ) : (
              <>
                <Navigation className="mr-2 h-4 w-4" />
                Activer le suivi
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm text-red-800 font-medium">
              Erreur de localisation
            </p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        )}

        {location && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-medium text-green-800">
                Position actuelle
              </p>
              {lastUpdated && (
                <span className="text-xs text-green-600">
                  Mise à jour: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
            <p className="text-sm text-green-700 mt-1">
              Conakry, Guinée
            </p>
            <p className="text-xs text-green-600 mt-1">
              Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
            </p>
            {isTracking && (
              <div className="mt-2 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
                <span className="text-xs text-green-700">Suivi en temps réel actif</span>
              </div>
            )}
          </div>
        )}

        {loading && !location && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <RefreshCw className="h-4 w-4 animate-spin text-blue-500 mr-2" />
              <span className="text-sm text-blue-700">Obtention de votre position...</span>
            </div>
          </div>
        )}

        {isMobile && location && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-700">
              <Navigation className="h-4 w-4 inline mr-1 text-blue-500" />
              Position obtenue automatiquement. Activez le suivi pour un suivi en temps réel.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationTracker;
