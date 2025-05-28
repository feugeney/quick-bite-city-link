
import DishCard from './DishCard';

type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_available: boolean;
};

type Category = {
  id: string;
  name: string;
  dishes: Dish[];
};

type MenuCategoriesProps = {
  categories: Category[];
  restaurantId: string;
};

const MenuCategories = ({ categories, restaurantId }: MenuCategoriesProps) => {
  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.id}>
          <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
          <div className="space-y-4">
            {category.dishes.map((dish) => (
              <DishCard 
                key={dish.id} 
                dish={dish} 
                restaurantId={restaurantId}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuCategories;
