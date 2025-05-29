
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import RestaurantDashboard from '@/components/dashboard/RestaurantDashboard';
import DeliveryDashboard from '@/components/dashboard/DeliveryDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserRole = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUserRole(data?.role || 'client');
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('client');
      } finally {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-guinea-subtle guinea-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
            <span className="text-white font-bold text-3xl">N</span>
          </div>
          <div className="text-2xl font-bold text-gradient-guinea mb-2">NimbaExpress</div>
          <p className="text-gray-600 text-lg">Chargement de votre tableau de bord...</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-secondary-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-accent-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'restaurant':
        return <RestaurantDashboard />;
      case 'delivery':
        return <DeliveryDashboard />;
      default:
        return <ClientDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-guinea-subtle guinea-pattern">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
