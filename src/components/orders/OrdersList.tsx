
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import OrderCard from './OrderCard';
import { OrderStatus } from './OrderStatusUtils';

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

interface OrdersListProps {
  orders: Order[];
  emptyMessage: string;
  updatingOrder: string | null;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onRefresh: () => void;
}

const OrdersList = ({ orders, emptyMessage, updatingOrder, onUpdateStatus, onRefresh }: OrdersListProps) => {
  if (orders.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="py-12 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <AlertCircle className="h-12 w-12 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-700">Aucune commande</h3>
              <p className="text-gray-500 max-w-sm">{emptyMessage}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={onRefresh}
              className="mt-4 bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          updatingOrder={updatingOrder}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};

export default OrdersList;
