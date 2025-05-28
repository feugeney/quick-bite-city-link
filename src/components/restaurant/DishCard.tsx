
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';

// Format price in Guinean Franc
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-GN', {
    style: 'currency',
    currency: 'GNF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

type DishProps = {
  dish: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    is_available: boolean;
  };
  restaurantId: string;
};

const DishCard = ({ dish, restaurantId }: DishProps) => {
  const { addItemToCart } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = () => {
    addItemToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      restaurantId: restaurantId,
    });
    
    toast({
      title: 'Plat ajouté au panier',
      description: `${dish.name} a été ajouté à votre commande`,
    });
  };
  
  return (
    <Card className="flex overflow-hidden hover:shadow-md transition-shadow mb-4">
      <div className="flex-1 p-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-500">
              {dish.name}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{dish.description}</p>
            <p className="text-primary-700 font-semibold mt-2">{formatPrice(dish.price)}</p>
            {!dish.is_available && (
              <Badge variant="secondary" className="mt-1">Indisponible</Badge>
            )}
          </div>
          <Button 
            size="sm" 
            className="self-end"
            onClick={handleAddToCart}
            disabled={!dish.is_available}
          >
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        </div>
      </div>
      {dish.image_url && (
        <div className="w-24 h-24 sm:w-32 sm:h-32">
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </Card>
  );
};

export default DishCard;
