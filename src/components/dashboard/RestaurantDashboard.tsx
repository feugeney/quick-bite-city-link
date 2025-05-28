
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MenuManager from '../menu/MenuManager';
import OrderManager from '../orders/OrderManager';
import RestaurantProfileManager from '../restaurant/RestaurantProfileManager';
import RestaurantStats from '../restaurant/RestaurantStats';
import RestaurantCreationForm from '../restaurant/RestaurantCreationForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurantInfo } from '@/hooks/useRestaurantInfo';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Menu, User, BarChart3, Store, TrendingUp, Clock, DollarSign } from 'lucide-react';

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const { user } = useAuth();
  const { restaurant, loading } = useRestaurantInfo();
  const { toast } = useToast();

  const handleRestaurantCreated = (newRestaurantId: string) => {
    toast({
      title: "Bienvenue !",
      description: "Votre restaurant a été créé. Vous pouvez maintenant gérer vos commandes et votre menu.",
    });
    // Le hook useRestaurantInfo se rechargera automatiquement
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <Store className="h-10 w-10 text-white" />
          </div>
          <p className="text-gray-600 font-medium text-lg">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <RestaurantCreationForm onRestaurantCreated={handleRestaurantCreated} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Section avec nom du restaurant */}
        <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-red-600 rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-3xl shadow-lg">
                  <Store className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
                  <p className="text-orange-100 text-lg">Tableau de bord restaurant</p>
                  <p className="text-orange-200 text-sm mt-1">{restaurant.address}</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Ouvert</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Commandes</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
                <p className="text-xs text-green-600 font-medium">+12% aujourd'hui</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Revenus</p>
                <p className="text-3xl font-bold text-gray-900">450k</p>
                <p className="text-xs text-blue-600 font-medium">GNF aujourd'hui</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Temps moyen</p>
                <p className="text-3xl font-bold text-gray-900">28</p>
                <p className="text-xs text-orange-600 font-medium">minutes</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Croissance</p>
                <p className="text-3xl font-bold text-gray-900">+18%</p>
                <p className="text-xs text-purple-600 font-medium">ce mois</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Onglets redesignés */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
              <TabsList className="grid grid-cols-4 w-full max-w-4xl mx-auto bg-gray-100 rounded-2xl p-2">
                <TabsTrigger 
                  value="orders" 
                  className="flex items-center gap-3 rounded-xl px-6 py-4 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-lg font-semibold transition-all"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span className="hidden sm:inline">Commandes</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="menu"
                  className="flex items-center gap-3 rounded-xl px-6 py-4 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-lg font-semibold transition-all"
                >
                  <Menu className="h-5 w-5" />
                  <span className="hidden sm:inline">Menu</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profile"
                  className="flex items-center gap-3 rounded-xl px-6 py-4 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-lg font-semibold transition-all"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Profil</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="stats"
                  className="flex items-center gap-3 rounded-xl px-6 py-4 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-lg font-semibold transition-all"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="hidden sm:inline">Stats</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-8">
              <TabsContent value="orders" className="space-y-4">
                <OrderManager />
              </TabsContent>
              
              <TabsContent value="menu" className="space-y-4">
                <MenuManager />
              </TabsContent>
              
              <TabsContent value="profile" className="space-y-4">
                <RestaurantProfileManager />
              </TabsContent>
              
              <TabsContent value="stats" className="space-y-4">
                <RestaurantStats restaurantId={restaurant.id} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
