
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast, toast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from './DishCard';

const CartSection = () => {
  const { cartItems, cartTotal, updateQuantity } = useCart();
  const navigate = useNavigate();
  
  // Handler for checkout button
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des plats à votre panier avant de passer commande",
        variant: "destructive"
      });
      return;
    }
    navigate('/checkout');
  };
  
  return (
    <div className="sticky top-20">
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Votre commande</h2>
        {cartItems.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">Votre panier est vide</p>
            <p className="text-sm text-gray-400 mt-2">Ajoutez des plats pour commencer</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 max-h-80 overflow-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center mt-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 text-sm">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>{formatPrice(5000)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>{formatPrice(cartTotal + 5000)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full mt-4"
              onClick={handleCheckout}
            >
              Passer la commande
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default CartSection;
