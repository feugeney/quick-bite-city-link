
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useOrderStatuses } from '@/hooks/useOrderStatuses';
import { OrderStatus } from './OrderStatusUtils';

interface OrderStatusDisplayProps {
  status: OrderStatus;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'preparing': return <ChefHat className="h-4 w-4" />;
    case 'ready': return <Package className="h-4 w-4" />;
    case 'out_for_delivery': return <Truck className="h-4 w-4" />;
    case 'delivered': return <CheckCircle className="h-4 w-4" />;
    case 'cancelled': return <XCircle className="h-4 w-4" />;
    default: return null;
  }
};

const OrderStatusDisplay = ({ status }: OrderStatusDisplayProps) => {
  const { getStatusInfo, loading } = useOrderStatuses();

  if (loading) {
    return (
      <div className="w-24 h-6 bg-gray-200 animate-pulse rounded"></div>
    );
  }

  const statusInfo = getStatusInfo(status);
  
  if (!statusInfo) {
    // Fallback pour la compatibilité
    return (
      <Badge className="bg-gray-100 text-gray-800 font-medium px-3 py-1">
        {status}
      </Badge>
    );
  }

  return (
    <Badge className={`${statusInfo.color} font-medium px-3 py-1 flex items-center gap-1`}>
      {getStatusIcon(status)}
      {statusInfo.name}
    </Badge>
  );
};

export default OrderStatusDisplay;
