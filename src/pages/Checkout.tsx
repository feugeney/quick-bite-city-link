import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import LocationGetter from '@/components/LocationGetter';
import { MapPin } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const deliveryFee = 5000;
  const total = cartTotal + deliveryFee;

  const handleLocationChange = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    toast({
      title: "Position détectée",
      description: "Votre position a été détectée avec succès.",
    });
    
    setAddress(`Conakry, Guinée (${lat.toFixed(6)}, ${lng.toFixed(6)})`);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour passer une commande",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    if (!address.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse de livraison",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Erreur",
        description: "Votre panier est vide",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const restaurantId = cartItems[0]?.restaurantId;
      
      if (!restaurantId || typeof restaurantId !== 'string') {
        throw new Error('ID de restaurant invalide');
      }
      
      console.log('Creating order with:', {
        user_id: user.id,
        restaurant_id: restaurantId,
        delivery_address: address.trim(),
        notes: notes.trim() || null,
        total_price: total,
        delivery_fee: deliveryFee,
        payment_method: paymentMethod,
        payment_completed: paymentMethod !== 'cash',
        delivery_latitude: coordinates?.lat || null,
        delivery_longitude: coordinates?.lng || null
      });
      
      // Créer la commande avec les bons noms de colonnes
      const orderData = {
        user_id: user.id,
        restaurant_id: restaurantId,
        delivery_address: address.trim(),
        notes: notes.trim() || null,
        total_price: total,
        status: 'pending' as const,
        delivery_fee: deliveryFee,
        payment_method: paymentMethod,
        payment_completed: paymentMethod !== 'cash',
        delivery_latitude: coordinates?.lat || null,
        delivery_longitude: coordinates?.lng || null
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();
      
      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(`Erreur lors de la création de la commande: ${orderError.message}`);
      }

      if (!order) {
        throw new Error('Aucune commande créée');
      }

      console.log('Order created successfully:', order);

      // Créer les éléments de commande
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        dish_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      console.log('Creating order items:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items creation error:', itemsError);
        // Nettoyer la commande créée en cas d'erreur
        await supabase.from('orders').delete().eq('id', order.id);
        throw new Error(`Erreur lors de l'ajout des articles: ${itemsError.message}`);
      }
      
      toast({
        title: "Commande passée avec succès",
        description: `Votre commande #${order.id.slice(-8)} a été envoyée au restaurant`,
      });
      
      clearCart();
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: `Impossible de passer votre commande: ${errorMessage}. Veuillez réessayer ultérieurement.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 mb-4">Votre panier est vide</p>
            <Button onClick={() => navigate('/dashboard')}>
              Retour aux restaurants
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations de livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckout} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse de livraison *</Label>
                  <div className="flex flex-col space-y-3">
                    <Input 
                      id="address" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      placeholder="Entrez votre adresse complète"
                      required
                      className="min-h-[40px]"
                    />
                    <div className="flex items-center">
                      <LocationGetter onLocationChange={handleLocationChange} />
                      {coordinates && (
                        <div className="ml-3 text-sm text-green-600 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Position détectée
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Instructions spéciales (optionnel)</Label>
                  <Textarea 
                    id="notes" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Instructions pour la livraison ou le restaurant"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment">Méthode de paiement *</Label>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="font-medium cursor-pointer flex-1">
                        Espèces à la livraison
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="mobile_money" id="mobile_money" />
                      <Label htmlFor="mobile_money" className="font-medium cursor-pointer flex-1">
                        Mobile Money
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !address.trim()}
                  size="lg"
                >
                  {loading ? 'Traitement en cours...' : `Confirmer la commande (${total.toLocaleString()} GNF)`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{(item.price * item.quantity).toLocaleString()} GNF</p>
                  </div>
                ))}
                
                <div className="flex justify-between">
                  <p>Sous-total</p>
                  <p>{cartTotal.toLocaleString()} GNF</p>
                </div>
                
                <div className="flex justify-between">
                  <p>Frais de livraison</p>
                  <p>{deliveryFee.toLocaleString()} GNF</p>
                </div>
                
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <p>Total</p>
                  <p>{total.toLocaleString()} GNF</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
