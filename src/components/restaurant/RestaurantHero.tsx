
import { Link } from 'react-router-dom';
import { ChevronLeft, Star, MapPin, Clock } from 'lucide-react';

type RestaurantHeroProps = {
  restaurant: {
    image: string;
    name: string;
    rating: number;
    reviewCount: number;
    distance: string;
    deliveryTime: string;
  };
};

const RestaurantHero = ({ restaurant }: RestaurantHeroProps) => {
  return (
    <div className="relative h-64 md:h-80">
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
        <Link to="/" className="inline-flex items-center mb-4 text-white bg-black/30 hover:bg-black/50 px-3 py-1 rounded-full">
          <ChevronLeft className="h-4 w-4 mr-1" /> Retour
        </Link>
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        <div className="flex items-center mt-2 space-x-4">
          <span className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            {restaurant.rating} ({restaurant.reviewCount} avis)
          </span>
          <span className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-200 mr-1" />
            {restaurant.distance}
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 text-gray-200 mr-1" />
            {restaurant.deliveryTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHero;
