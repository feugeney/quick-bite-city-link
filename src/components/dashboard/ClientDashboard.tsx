
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import OrderTracker from '../orders/OrderTracker';
import { Clock, MapPin, History, ShoppingBag, Heart, Star, Plus, Search, Gift, User, Sparkles } from 'lucide-react';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();

  const handleNewOrder = () => {
    navigate('/nearby');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero moderne style Glovo */}
        <div className="relative mb-8 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center mb-3">
                  <Sparkles className="h-6 w-6 text-yellow-300 mr-2" />
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Bonjour !
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Que voulez-vous manger ?
                </h1>
                <p className="text-purple-100 text-lg">
                  Découvrez des saveurs incroyables près de chez vous
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-medium">Conakry</span>
              </div>
            </div>
            
            {/* Barre de recherche style Glovo */}
            <div className="bg-white rounded-2xl p-2 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-4 py-3 bg-gray-50 rounded-xl">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700 font-medium text-sm">Votre position</span>
                </div>
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Restaurant, plat, cuisine..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <Button 
                  onClick={handleNewOrder}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides style Glovo */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Vos raccourcis</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={handleNewOrder}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Commander</h3>
              <p className="text-sm text-gray-500">200+ restaurants</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Favoris</h3>
              <p className="text-sm text-gray-500">Vos préférés</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Promos</h3>
              <p className="text-sm text-gray-500">Offres spéciales</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Profil</h3>
              <p className="text-sm text-gray-500">Mon compte</p>
            </div>
          </div>
        </div>

        {/* Onglets modernisés */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-gray-50 px-6 py-4">
              <TabsList className="grid grid-cols-3 w-full bg-white rounded-xl p-1 shadow-sm">
                <TabsTrigger 
                  value="orders" 
                  className="flex items-center gap-2 rounded-lg px-4 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white font-semibold transition-all"
                >
                  <Clock className="h-4 w-4" />
                  <span>Commandes</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="addresses" 
                  className="flex items-center gap-2 rounded-lg px-4 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white font-semibold transition-all"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Adresses</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="flex items-center gap-2 rounded-lg px-4 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white font-semibold transition-all"
                >
                  <History className="h-4 w-4" />
                  <span>Historique</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="orders">
                <OrderTracker />
              </TabsContent>
              
              <TabsContent value="addresses" className="space-y-4">
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Gérez vos adresses</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">Ajoutez vos adresses favorites pour des commandes encore plus rapides</p>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                    <Plus className="h-5 w-5 mr-2" />
                    Ajouter une adresse
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <History className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Votre historique</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">Retrouvez toutes vos commandes passées et recommandez facilement</p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                    <History className="h-5 w-5 mr-2" />
                    Voir l'historique
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Bouton flottant style Glovo */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleNewOrder}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
            size="icon"
          >
            <ShoppingBag className="h-7 w-7" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
