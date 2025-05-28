
import { Navigation, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvailableOrder } from '@/hooks/useDeliveryDashboard';

interface CurrentDeliveryProps {
  currentDelivery: AvailableOrder;
  onCompleteDelivery: (orderId: string) => void;
}

const CurrentDelivery = ({ currentDelivery, onCompleteDelivery }: CurrentDeliveryProps) => {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Navigation className="h-5 w-5" />
          Livraison en cours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              Commande pour {currentDelivery.profiles.first_name} {currentDelivery.profiles.last_name}
            </h3>
            <p className="text-sm text-gray-600">
              {currentDelivery.total_price.toLocaleString()} GNF
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Restaurant</h4>
              <p className="text-sm text-gray-700">{currentDelivery.restaurants.name}</p>
              <p className="text-xs text-gray-500">{currentDelivery.restaurants.address}</p>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Livraison</h4>
              <p className="text-sm text-gray-700">{currentDelivery.delivery_address}</p>
            </div>
          </div>

          <Button 
            onClick={() => onCompleteDelivery(currentDelivery.id)}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Marquer comme livré
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentDelivery;
