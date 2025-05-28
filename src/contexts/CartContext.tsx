
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
};

type CartContextType = {
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  addItemToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  const cartCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );
  
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cartItems]);
  
  const addItemToCart = (item: CartItem) => {
    console.log('Adding item to cart:', item);
    
    if (!item.restaurantId || typeof item.restaurantId !== 'string' || item.restaurantId.trim() === '') {
      console.error('Invalid restaurantId:', item.restaurantId);
      toast({
        title: "Erreur",
        description: "ID de restaurant invalide",
        variant: "destructive",
      });
      return;
    }

    if (!item.id || !item.name || typeof item.price !== 'number' || item.price <= 0 || typeof item.quantity !== 'number' || item.quantity <= 0) {
      console.error('Invalid item data:', item);
      toast({
        title: "Erreur",
        description: "Données d'article invalides",
        variant: "destructive",
      });
      return;
    }
    
    setCartItems((prevItems) => {
      const hasItemsFromDifferentRestaurant = prevItems.length > 0 && 
        prevItems[0].restaurantId !== item.restaurantId;
      
      if (hasItemsFromDifferentRestaurant) {
        toast({
          title: "Attention",
          description: `Votre panier contient déjà des articles d'un autre restaurant. Voulez-vous créer une nouvelle commande?`,
          variant: "destructive",
        });
        return prevItems;
      }
      
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        };
        
        toast({
          title: "Article ajouté",
          description: `${item.name} a été ajouté à votre panier`,
        });
        
        return updatedItems;
      } else {
        toast({
          title: "Article ajouté",
          description: `${item.name} a été ajouté à votre panier`,
        });
        
        return [...prevItems, item];
      }
    });
  };
  
  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== itemId);
      
      if (updatedItems.length !== prevItems.length) {
        toast({
          title: "Article supprimé",
          description: "L'article a été retiré de votre panier",
        });
      }
      
      return updatedItems;
    });
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Panier vidé",
      description: "Votre panier a été vidé",
    });
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        cartCount,
        addItemToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
