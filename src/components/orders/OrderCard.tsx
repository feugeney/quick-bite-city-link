import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin, FileText, DollarSign, Package } from 'lucide-react';
import { OrderStatus, formatPrice } from './OrderStatusUtils';
import OrderStatusDisplay from './OrderStatusDisplay';
import OrderActions from './OrderActions';
import { useAuth } from '@/contexts/AuthContext';

interface Order {
  id: string;
  status: OrderStatus;
  total_price: number;
  delivery_address: string;
  created_at: string;
  notes: string | null;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
  order_items: {
    quantity: number;
    price: number;
    dishes: {
      name: string;
    };
  }[];
}

interface OrderCardProps {
  order: Order;
  updatingOrder: string | null;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderCard = ({ order, updatingOrder, onUpdateStatus }: OrderCardProps) => {
  const { user } = useAuth();
  const isUpdating = updatingOrder === order.id;

  // Déterminer le rôle de l'utilisateur
  const getUserRole = () => {
    // Cette logique devrait être adaptée selon votre système de rôles
    // Pour l'instant, on assume que les propriétaires de restaurant ont le rôle 'restaurant'
    return 'restaurant'; // ou 'livreur' selon le contexte
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    console.log(`[OrderCard] Attempting to update order ${order.id} from ${order.status} to ${newStatus}`);
    
    try {
      await onUpdateStatus(order.id, newStatus);
      console.log(`[OrderCard] Successfully updated order ${order.id} to ${newStatus}`);
    } catch (error) {
      console.error(`[OrderCard] Error updating order ${order.id}:`, error);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 bg-gradient-to-r from-white to-gray-50/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-3 text-gray-800">
            <div className="p-2 rounded-full bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="font-bold">Commande #{order.id.slice(-8)}</span>
              <div className="text-sm font-normal text-gray-500 mt-1">
                {new Date(order.created_at).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </CardTitle>
          <OrderStatusDisplay status={order.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Client Information */}
        <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-gray-800">Informations client</h4>
          </div>
          <p className="font-medium text-gray-900 text-lg">
            {order.profiles.first_name} {order.profiles.last_name}
          </p>
        </div>
        
        {/* Delivery Information */}
        <div className="bg-green-50/50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-gray-800">Adresse de livraison</h4>
          </div>
          <p className="text-gray-700">{order.delivery_address}</p>
          {order.notes && (
            <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
              <div className="flex items-center gap-1 mb-1">
                <FileText className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Notes:</span>
              </div>
              <p className="text-sm text-yellow-700">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-600" />
            Articles commandés ({order.order_items.length})
          </h4>
          <div className="space-y-3">
            {order.order_items.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                <div className="flex items-center gap-3">
                  <span className="bg-primary/10 text-primary font-bold px-2 py-1 rounded text-sm">
                    {item.quantity}x
                  </span>
                  <span className="font-medium text-gray-800">{item.dishes.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total and Actions */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-lg font-bold text-green-800">
              Total: {formatPrice(order.total_price)}
            </span>
          </div>
          
          <OrderActions
            orderId={order.id}
            currentStatus={order.status}
            userRole={getUserRole()}
            isUpdating={isUpdating}
            onUpdateStatus={handleStatusUpdate}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
