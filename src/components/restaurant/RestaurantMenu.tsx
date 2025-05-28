
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import MenuManager from '@/components/menu/MenuManager';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  menu_category_id: string | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface RestaurantMenuProps {
  restaurantId: string;
}

const RestaurantMenu = ({ restaurantId }: RestaurantMenuProps) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const { toast } = useToast();
  const { addItemToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const checkOwnership = async () => {
      if (!user || !restaurantId) return;

      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('owner_id')
          .eq('id', restaurantId)
          .single();

        if (error) throw error;
        setIsOwner(data.owner_id === user.id);
      } catch (error) {
        console.error('Error checking ownership:', error);
      }
    };

    checkOwnership();
  }, [user, restaurantId]);

  useEffect(() => {
    const fetchMenuData = async () => {
      if (!restaurantId) return;

      setLoading(true);
      try {
        // Récupérer le menu actif du restaurant
        const { data: menu, error: menuError } = await supabase
          .from('menus')
          .select('id')
          .eq('restaurant_id', restaurantId)
          .eq('is_active', true)
          .maybeSingle();

        if (menuError) throw menuError;

        if (!menu) {
          setDishes([]);
          setCategories([]);
          return;
        }

        // Récupérer les catégories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('menu_id', menu.id)
          .order('display_order', { ascending: true });

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        // Récupérer les plats
        const { data: dishesData, error: dishesError } = await supabase
          .from('dishes')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('is_available', true)
          .order('name');

        if (dishesError) throw dishesError;
        setDishes(dishesData || []);

      } catch (error: any) {
        console.error("Error fetching menu data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le menu du restaurant",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [restaurantId, toast]);

  const handleAddToCart = (dish: Dish) => {
    addItemToCart({
      id: dish.id,
      restaurantId: restaurantId,
      name: dish.name,
      price: dish.price,
      quantity: 1
    });
    
    toast({
      title: "Ajouté au panier",
      description: `${dish.name} a été ajouté à votre panier`
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Chargement du menu...</p>
      </div>
    );
  }

  // Si l'utilisateur est propriétaire, afficher le gestionnaire de menu
  if (isOwner) {
    return <MenuManager />;
  }

  // Pour les clients, afficher le menu public
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Menu</h2>
      
      {dishes.length > 0 ? (
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryDishes = dishes.filter(dish => dish.menu_category_id === category.id);
            
            if (categoryDishes.length === 0) return null;

            return (
              <div key={category.id} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-600">{category.description}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryDishes.map((dish) => (
                    <Card key={dish.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{dish.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {dish.image_url && (
                          <img
                            src={dish.image_url}
                            alt={dish.name}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        )}
                        <p className="text-sm text-gray-600">{dish.description}</p>
                        <p className="text-lg font-semibold text-primary">
                          {formatPrice(dish.price)}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => handleAddToCart(dish)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter au panier
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Plats sans catégorie */}
          {dishes.filter(dish => !dish.menu_category_id).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Autres plats</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dishes
                  .filter(dish => !dish.menu_category_id)
                  .map((dish) => (
                    <Card key={dish.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{dish.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {dish.image_url && (
                          <img
                            src={dish.image_url}
                            alt={dish.name}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        )}
                        <p className="text-sm text-gray-600">{dish.description}</p>
                        <p className="text-lg font-semibold text-primary">
                          {formatPrice(dish.price)}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => handleAddToCart(dish)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter au panier
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Ce restaurant n'a pas encore de menu.</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
