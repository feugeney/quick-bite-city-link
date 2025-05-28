
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface RestaurantStatsProps {
  restaurantId: string;
}

interface OrderData {
  status: string;
  count: number;
}

interface RevenueStat {
  date: string;
  revenue: number;
}

const RestaurantStats = ({ restaurantId }: RestaurantStatsProps) => {
  const [orderStats, setOrderStats] = useState<OrderData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueStat[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64dff'];
  
  useEffect(() => {
    if (restaurantId) {
      fetchStats();
    }
  }, [restaurantId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all orders for the restaurant
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('status')
        .eq('restaurant_id', restaurantId);
      
      if (orderError) throw orderError;
      
      // Process orders to count by status
      const statusCounts: Record<string, number> = {};
      
      // Count occurrences of each status
      orderData?.forEach(order => {
        const status = order.status;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      
      // Convert to array format needed for charts
      const processedOrderStats = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count
      }));
      
      // Fetch daily revenue data for the last 7 days
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);
      
      const { data: revenueStats, error: revenueError } = await supabase
        .from('orders')
        .select('created_at, total_price')
        .eq('restaurant_id', restaurantId)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true });
      
      if (revenueError) throw revenueError;
      
      // Process revenue data by day
      const dailyRevenue: { [key: string]: number } = {};
      
      revenueStats?.forEach(order => {
        const date = new Date(order.created_at).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit'
        });
        
        dailyRevenue[date] = (dailyRevenue[date] || 0) + Number(order.total_price);
      });
      
      // Fill in missing days
      const allRevenueData: RevenueStat[] = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - (6 - i));
        
        const dateKey = date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit'
        });
        
        allRevenueData.push({
          date: dateKey,
          revenue: dailyRevenue[dateKey] || 0
        });
      }
      
      setOrderStats(processedOrderStats);
      setRevenueData(allRevenueData);
      
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

  const formatOrderStatus = (status: string): string => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'preparing': return 'En préparation';
      case 'ready': return 'Prête';
      case 'out_for_delivery': return 'En livraison';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  // Process data for charts
  const chartData = orderStats.map(stat => ({
    name: formatOrderStatus(stat.status),
    value: stat.count,
    status: stat.status
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tableau de bord des statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribution des commandes</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value} commandes`, 'Quantité']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenus des 7 derniers jours</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `${(value/1000)}k`} />
                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenu']} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenu" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500">Total des commandes</p>
                <p className="text-2xl font-bold mt-2">
                  {chartData.reduce((sum, item) => sum + item.value, 0)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500">Revenu total</p>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(revenueData.reduce((sum, day) => sum + day.revenue, 0))}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500">Revenu moyen par jour</p>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(revenueData.reduce((sum, day) => sum + day.revenue, 0) / 7)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500">Livraisons complétées</p>
                <p className="text-2xl font-bold mt-2">
                  {chartData.find(item => item.status === 'delivered')?.value || 0}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantStats;
