
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationGetterProps {
  onLocationChange: (lat: number, lng: number) => void;
}

const LocationGetter = ({ onLocationChange }: LocationGetterProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'getting' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  useEffect(() => {
    // Check if geolocation is available
    if ('geolocation' in navigator) {
      setIsAvailable(true);
    }
  }, []);

  const getLocation = () => {
    if (!isAvailable) {
      toast({
        title: "Géolocalisation non disponible",
        description: "Votre appareil ne prend pas en charge la géolocalisation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLocationStatus('getting');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationChange(latitude, longitude);
        setLocationStatus('success');
        toast({
          title: "Position détectée",
          description: "Votre position a été détectée avec succès.",
        });
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast({
          title: "Erreur de géolocalisation",
          description: error.message || "Impossible de déterminer votre position.",
          variant: "destructive",
        });
        setLocationStatus('error');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <Button 
      type="button" 
      variant={locationStatus === 'success' ? "outline" : "default"}
      onClick={getLocation} 
      disabled={isLoading || !isAvailable}
      className="flex items-center gap-2"
    >
      <MapPin className="w-4 h-4" />
      {locationStatus === 'getting' && "Détection de votre position..."}
      {locationStatus === 'idle' && "Détecter ma position"}
      {locationStatus === 'success' && "Position détectée"}
      {locationStatus === 'error' && "Réessayer la détection"}
    </Button>
  );
};

export default LocationGetter;
