
import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import LocationGetter from './LocationGetter';

interface LocationMapProps {
  className?: string;
}

const LocationMap = ({ className = '' }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('Conakry, Guinée');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLocationChange = async (lat: number, lng: number) => {
    setLocation({ lat, lng });

    try {
      setIsLoading(true);
      // Ici, on pourrait utiliser une API de géocodage inversé pour obtenir le nom de l'emplacement
      // Pour l'instant, on suppose simplement que c'est dans Conakry
      setLocationName('Conakry, Guinée');
      setIsLoading(false);
    } catch (error) {
      console.error('Error getting location name:', error);
      toast({
        title: "Erreur",
        description: "Impossible de déterminer le nom de votre emplacement",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!location || !mapContainer.current) return;

    // Placeholder for map integration (would use Leaflet, Mapbox or Google Maps)
    const mapDiv = mapContainer.current;
    mapDiv.innerHTML = '';

    const mapPlaceholder = document.createElement('div');
    mapPlaceholder.className = 'flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg';
    
    const mapIcon = document.createElement('div');
    mapIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><circle cx="12" cy="10" r="3"></circle><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path></svg>`;

    const mapText = document.createElement('p');
    mapText.className = 'mt-2 text-center text-gray-700';
    mapText.textContent = `Carte interactive de ${locationName}`;
    
    const mapCoords = document.createElement('p');
    mapCoords.className = 'text-sm text-center text-gray-500 mt-1';
    mapCoords.textContent = `Lat: ${location.lat.toFixed(5)}, Lng: ${location.lng.toFixed(5)}`;

    mapPlaceholder.appendChild(mapIcon);
    mapPlaceholder.appendChild(mapText);
    mapPlaceholder.appendChild(mapCoords);
    mapDiv.appendChild(mapPlaceholder);
    
    // Note: Dans une implémentation réelle, vous remplaceriez ce code par 
    // une véritable intégration de carte (Leaflet, Mapbox, Google Maps)
  }, [location, locationName]);

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Votre emplacement</h3>
        {isLoading ? (
          <div className="flex items-center text-gray-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Chargement...
          </div>
        ) : location ? (
          <div className="flex items-center text-primary-600">
            <MapPin className="mr-1 h-4 w-4" />
            <span className="text-sm">{locationName}</span>
          </div>
        ) : null}
      </div>
      
      <div className="mb-4">
        <LocationGetter onLocationChange={handleLocationChange} />
      </div>
      
      <div 
        ref={mapContainer} 
        className="w-full h-48 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center h-full">
          <MapPin className="h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Utilisez le bouton ci-dessus pour détecter votre position</p>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
