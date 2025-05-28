
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  lat: number;
  lng: number;
}

export const useAutoLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      const errorMsg = "La géolocalisation n'est pas supportée par ce navigateur";
      setError(errorMsg);
      setLoading(false);
      toast({
        title: "Géolocalisation non supportée",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLocation({ lat, lng });
        setLoading(false);
        console.log('Position obtenue automatiquement:', { lat, lng });
      },
      (error) => {
        let errorMsg = "Impossible d'obtenir votre position";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Accès à la localisation refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Informations de localisation non disponibles.";
            break;
          case error.TIMEOUT:
            errorMsg = "Délai d'attente dépassé pour obtenir la localisation.";
            break;
        }
        
        setError(errorMsg);
        setLoading(false);
        console.error('Erreur de géolocalisation:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const refreshLocation = () => {
    getCurrentLocation();
  };

  return { 
    location, 
    loading, 
    error, 
    refreshLocation 
  };
};
