
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useOrderStatuses, StatusTransition } from '@/hooks/useOrderStatuses';
import { OrderStatus } from './OrderStatusUtils';

interface OrderActionsProps {
  orderId: string;
  currentStatus: OrderStatus;
  userRole: string;
  isUpdating: boolean;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderActions = ({
  orderId,
  currentStatus,
  userRole,
  isUpdating,
  onUpdateStatus
}: OrderActionsProps) => {
  const { getAvailableTransitions, validateTransition } = useOrderStatuses();
  const [availableTransitions, setAvailableTransitions] = useState<StatusTransition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvailableTransitions();
  }, [currentStatus, userRole]);

  const loadAvailableTransitions = async () => {
    setLoading(true);
    try {
      const transitions = await getAvailableTransitions(currentStatus, userRole);
      setAvailableTransitions(transitions);
    } catch (error) {
      console.error('Error loading transitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransition = async (toStatus: string) => {
    console.log(`[OrderActions] Attempting transition from ${currentStatus} to ${toStatus}`);
    
    // Valider la transition
    const isValid = await validateTransition(currentStatus, toStatus);
    if (!isValid) {
      console.error(`[OrderActions] Invalid transition from ${currentStatus} to ${toStatus}`);
      return;
    }

    onUpdateStatus(orderId, toStatus as OrderStatus);
  };

  if (loading) {
    return (
      <div className="flex gap-2">
        <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (availableTransitions.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-3">
      {availableTransitions.map((transition) => {
        const isRejectAction = transition.to_status_code === 'cancelled';
        const isAcceptAction = transition.to_status_code === 'preparing' && currentStatus === 'pending';
        
        return (
          <Button
            key={transition.to_status_code}
            variant={isRejectAction ? "destructive" : isAcceptAction ? "default" : "outline"}
            size="sm"
            onClick={() => handleTransition(transition.to_status_code)}
            disabled={isUpdating}
            className={
              isRejectAction 
                ? "hover:bg-red-600 transition-colors" 
                : isAcceptAction 
                  ? "bg-green-600 hover:bg-green-700 transition-colors"
                  : "bg-blue-600 hover:bg-blue-700 transition-colors text-white"
            }
          >
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Traitement...
              </div>
            ) : (
              transition.action_name
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default OrderActions;
