
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AvailableOrder } from '@/hooks/useDeliveryDashboard';

interface AvailableOrdersProps {
  availableOrders: AvailableOrder[];
  currentDelivery: AvailableOrder | null;
  onAcceptOrder: (orderId: string) => void;
}

const AvailableOrders = ({ availableOrders, currentDelivery, onAcceptOrder }: AvailableOrdersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary-500" />
          Commandes disponibles
        </CardTitle>
      </CardHeader>
      <CardContent>
        {availableOrders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Aucune commande disponible pour le moment
          </p>
        ) : (
          <div className="space-y-4">
            {availableOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {order.profiles.first_name} {order.profiles.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">
                      Prêt à livrer
                    </Badge>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {order.total_price.toLocaleString()} GNF
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Restaurant</h4>
                    <p className="text-sm text-gray-700">{order.restaurants.name}</p>
                    <p className="text-xs text-gray-500">{order.restaurants.address}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Livraison</h4>
                    <p className="text-sm text-gray-700">{order.delivery_address}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => onAcceptOrder(order.id)}
                  className="w-full"
                  disabled={!!currentDelivery}
                >
                  {currentDelivery ? 'Livraison en cours' : 'Accepter cette livraison'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableOrders;
