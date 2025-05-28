
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CategoryManager from './CategoryManager';
import DishList from './DishList';
import DishEditor from './DishEditor';

interface Menu {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  menu_id: string;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  menu_category_id: string | null;
}

const MenuManager = () => {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [dishEditorOpen, setDishEditorOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRestaurantMenu();
    }
  }, [user]);

  const fetchRestaurantMenu = async () => {
    try {
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user?.id)
        .single();

      if (restaurantError) throw restaurantError;

      const { data: menuData, error: menuError } = await supabase
        .from('menus')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .eq('is_active', true)
        .maybeSingle();

      if (menuError) throw menuError;

      if (menuData) {
        setMenu(menuData);
        await fetchCategories(menuData.id);
        await fetchDishes(menuData.id);
      } else {
        await createDefaultMenu(restaurant.id);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le menu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultMenu = async (restaurantId: string) => {
    try {
      const { data: newMenu, error } = await supabase
        .from('menus')
        .insert({
          name: 'Menu Principal',
          description: 'Menu principal du restaurant',
          restaurant_id: restaurantId,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      setMenu(newMenu);
    } catch (error) {
      console.error('Error creating default menu:', error);
    }
  };

  const fetchCategories = async (menuId: string) => {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('menu_id', menuId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchDishes = async (menuId: string) => {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select(`
          *,
          menu_categories!inner(menu_id)
        `)
        .eq('menu_categories.menu_id', menuId)
        .order('name');

      if (error) throw error;
      setDishes(data || []);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  const handleDishCreated = (newDish: Dish) => {
    if (editingDish) {
      // Update existing dish
      setDishes(prev => prev.map(dish => 
        dish.id === newDish.id ? newDish : dish
      ));
    } else {
      // Add new dish
      setDishes(prev => [...prev, newDish]);
    }
    
    setDishEditorOpen(false);
    setEditingDish(undefined);
  };

  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setDishEditorOpen(true);
  };

  const handleAddNewDish = () => {
    setEditingDish(undefined);
    setDishEditorOpen(true);
  };

  const handleDeleteDish = async (dishId: string) => {
    try {
      const { error } = await supabase
        .from('dishes')
        .delete()
        .eq('id', dishId);

      if (error) throw error;

      setDishes(prev => prev.filter(dish => dish.id !== dishId));
      toast({
        title: "Succès",
        description: "Plat supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le plat",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement du menu...</p>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="p-6 text-center">
        <p>Aucun menu trouvé. Création en cours...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion du Menu</CardTitle>
          <Button onClick={handleAddNewDish} disabled={categories.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un plat
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <CategoryManager 
            menuId={menu.id} 
            categories={categories}
            onCategoriesChange={setCategories}
          />
          
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Veuillez d'abord créer au moins une catégorie</p>
              <p className="text-sm">pour pouvoir ajouter des plats</p>
            </div>
          ) : (
            <DishList
              dishes={dishes}
              categories={categories}
              onEditDish={handleEditDish}
              onDeleteDish={handleDeleteDish}
            />
          )}
        </CardContent>
      </Card>

      <DishEditor
        dish={editingDish}
        open={dishEditorOpen}
        onOpenChange={(open) => {
          setDishEditorOpen(open);
          if (!open) {
            setEditingDish(undefined);
          }
        }}
        categories={categories}
        onDishCreated={handleDishCreated}
      />
    </div>
  );
};

export default MenuManager;
