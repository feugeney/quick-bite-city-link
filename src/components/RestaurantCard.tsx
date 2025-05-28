
import { Star, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    address: string;
    phone: string;
  };
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="block">
      <div className="group cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.image_url || '/placeholder.svg'}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge className="bg-primary-500 text-white">
              Populaire
            </Badge>
          </div>

          {/* Delivery Time */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
            <Clock className="h-3 w-3 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">20-30 min</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-primary-500 transition-colors">
              {restaurant.name}
            </h3>
            <div className="flex items-center space-x-1 text-sm">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-medium text-gray-700">4.5</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3">{restaurant.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{restaurant.address}</span>
            </div>
            <span className="font-medium">€€</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
