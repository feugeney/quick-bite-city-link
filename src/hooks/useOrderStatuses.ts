
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface OrderStatusInfo {
  id: number;
  code: string;
  name: string;
  description: string;
  color: string;
  display_order: number;
}

export interface StatusTransition {
  to_status_code: string;
  to_status_name: string;
  action_name: string;
  action_description: string;
}

export const useOrderStatuses = () => {
  const [statuses, setStatuses] = useState<OrderStatusInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('order_statuses')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setStatuses(data || []);
    } catch (error) {
      console.error('Error fetching order statuses:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statuts de commande",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (statusCode: string): OrderStatusInfo | undefined => {
    return statuses.find(status => status.code === statusCode);
  };

  const getAvailableTransitions = async (currentStatus: string, userRole: string): Promise<StatusTransition[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_available_order_status_transitions', {
          current_status_code: currentStatus,
          user_role: userRole
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching available transitions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les transitions disponibles",
        variant: "destructive",
      });
      return [];
    }
  };

  const validateTransition = async (fromStatus: string, toStatus: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('is_valid_order_status_transition', {
          from_status: fromStatus,
          to_status: toStatus
        });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error validating transition:', error);
      return false;
    }
  };

  return {
    statuses,
    loading,
    getStatusInfo,
    getAvailableTransitions,
    validateTransition,
    refetch: fetchStatuses
  };
};
