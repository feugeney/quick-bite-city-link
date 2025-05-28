
import { useState, useEffect } from 'react';
import { Users, Store, Truck, TrendingUp, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from '@/components/admin/UserManagement';
import RestaurantManagement from '@/components/admin/RestaurantManagement';
import DeliveryManagement from '@/components/admin/DeliveryManagement';
import RestaurantApplications from '@/components/admin/RestaurantApplications';
import DeliveryApplications from '@/components/admin/DeliveryApplications';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Stats {
  totalUsers: number;
  totalRestaurants: number;
  totalDeliveryPersons: number;
  totalOrders: number;
  pendingRestaurantApplications: number;
  pendingDeliveryApplications: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalRestaurants: 0,
    totalDeliveryPersons: 0,
    totalOrders: 0,
    pendingRestaurantApplications: 0,
    pendingDeliveryApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch user stats
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', 'client');

      const { count: restaurantCount } = await supabase
        .from('restaurants')
        .select('*', { count: 'exact' });

      const { count: deliveryCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', 'livreur');

      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact' });

      // Fetch pending applications
      const { count: pendingRestaurantApps } = await supabase
        .from('restaurant_applications')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      const { count: pendingDeliveryApps } = await supabase
        .from('delivery_applications')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      setStats({
        totalUsers: userCount || 0,
        totalRestaurants: restaurantCount || 0,
        totalDeliveryPersons: deliveryCount || 0,
        totalOrders: orderCount || 0,
        pendingRestaurantApplications: pendingRestaurantApps || 0,
        pendingDeliveryApplications: pendingDeliveryApps || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Administrateur
          </h1>
          <p className="text-gray-600">
            Gérez la plateforme NimbaExpress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Store className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Restaurants</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRestaurants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Livreurs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveryPersons}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Commandes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Demandes Restaurant</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingRestaurantApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-indigo-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Demandes Livreur</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingDeliveryApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="applications">
              <TabsList className="mb-6">
                <TabsTrigger value="applications">Demandes en attente</TabsTrigger>
                <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                <TabsTrigger value="delivery">Livreurs</TabsTrigger>
              </TabsList>

              <TabsContent value="applications">
                <div className="space-y-8">
                  <RestaurantApplications />
                  <DeliveryApplications />
                </div>
              </TabsContent>

              <TabsContent value="users">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Gestion des utilisateurs</h3>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouvel utilisateur
                    </Button>
                  </div>
                  <UserManagement />
                </div>
              </TabsContent>

              <TabsContent value="restaurants">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Gestion des restaurants</h3>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau restaurant
                    </Button>
                  </div>
                  <RestaurantManagement />
                </div>
              </TabsContent>

              <TabsContent value="delivery">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Gestion des livreurs</h3>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau livreur
                    </Button>
                  </div>
                  <DeliveryManagement />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
