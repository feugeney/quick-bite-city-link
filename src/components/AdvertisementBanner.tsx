
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Advertisement {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
  created_at: string;
}

const AdvertisementBanner = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [currentAd, setCurrentAd] = useState(0);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        setIsLoading(true);
        // Pour le moment, on utilise un mock puisque la table n'existe pas encore
        // Dans une implémentation réelle, vous remplaceriez ceci par un appel à Supabase
        const mockAds: Advertisement[] = [
          {
            id: '1',
            title: 'Découvrez les meilleurs restaurants de Conakry',
            description: 'Livraison rapide et sécurisée partout à Conakry',
            image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
            link: '/restaurants',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Promotion spéciale à Conakry',
            description: 'Profitez de -30% sur votre première commande à Conakry',
            image_url: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828',
            link: '/promotions',
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'Livraison express en 30 min',
            description: 'Notre service de livraison rapide couvre toute la ville de Conakry',
            image_url: 'https://images.unsplash.com/photo-1526367790999-0150786686a2',
            link: '/delivery',
            created_at: new Date().toISOString(),
          }
        ];
        
        setAdvertisements(mockAds);
      } catch (error) {
        console.error('Error fetching advertisements:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les annonces",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvertisements();
  }, [toast]);

  useEffect(() => {
    // Rotation automatique des annonces toutes les 5 secondes
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % Math.max(advertisements.length, 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [advertisements.length]);

  if (isLoading) {
    return (
      <div className="relative w-full h-80 bg-muted rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (advertisements.length === 0) {
    return null;
  }

  const ad = advertisements[currentAd];

  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg mb-8">
      {/* Image de fond */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${ad.image_url})`,
          filter: 'brightness(0.7)'
        }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
      
      {/* Contenu */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">{ad.title}</h2>
        <p className="text-lg mb-4">{ad.description}</p>
        <Button 
          variant="default" 
          className="self-start bg-primary hover:bg-primary/90"
          onClick={() => window.location.href = ad.link}
        >
          En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      {/* Indicateurs de pagination */}
      <div className="absolute bottom-4 right-6 flex space-x-2">
        {advertisements.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentAd ? "w-6 bg-primary" : "w-2 bg-white/50"
            }`}
            onClick={() => setCurrentAd(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdvertisementBanner;
