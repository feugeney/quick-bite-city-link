
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';

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

interface DishListProps {
  dishes: Dish[];
  categories: Category[];
  onEditDish: (dish: Dish) => void;
  onDeleteDish: (dishId: string) => void;
}

const DishList = ({ dishes, categories, onEditDish, onDeleteDish }: DishListProps) => {
  const getCategoryName = (categoryId: string | null) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Sans catégorie';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (dishes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          Aucun plat dans le menu. Commencez par ajouter des plats !
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Plats du Menu ({dishes.length})</h3>
      <div className="grid gap-4">
        {dishes.map((dish) => (
          <Card key={dish.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {dish.image_url && (
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{dish.name}</h4>
                      <p className="text-gray-600 text-sm mt-1">{dish.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          {getCategoryName(dish.menu_category_id)}
                        </Badge>
                        <Badge variant={dish.is_available ? "default" : "secondary"}>
                          {dish.is_available ? 'Disponible' : 'Indisponible'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">
                        {formatPrice(dish.price)}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditDish(dish)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteDish(dish.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DishList;
