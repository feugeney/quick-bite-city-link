
import { MapPin, Phone, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

type RestaurantInfoProps = {
  restaurant: {
    address: string;
    phone: string;
    openingHours: string;
  };
};

const RestaurantInfo = ({ restaurant }: RestaurantInfoProps) => {
  return (
    <Card className="mb-6 p-4">
      <h2 className="text-xl font-semibold mb-2">Informations</h2>
      <div className="text-gray-700 space-y-2">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
          <span>{restaurant.address}</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-5 w-5 mr-2 text-gray-500" />
          <span>{restaurant.phone}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-gray-500" />
          <span>Ouvert: {restaurant.openingHours}</span>
        </div>
      </div>
    </Card>
  );
};

export default RestaurantInfo;
