import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import OrderTracker from '../orders/OrderTracker';
import { Clock, MapPin, History, ShoppingBag, Heart, Star, Plus, Search, Filter, Truck, CreditCard, User, Settings, Gift } from 'lucide-react';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();

  const handleNewOrder = () => {
    navigate('/nearby');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section avec recherche moderne */}
        <div className="relative mb-8 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Bonjour ! 👋
                </h1>
                <p className="text-green-100 text-lg">
                  Que souhaitez-vous commander aujourd'hui ?
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-medium">Conakry</span>
              </div>
            </div>
            
            {/* Barre de recherche intégrée */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600 font-medium">Livrer à</span>
                <span className="text-sm text-gray-900 font-semibold">Votre position actuelle</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher restaurants, plats, cuisines..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 text-lg"
                  />
                </div>
                <Button className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides redesignées */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Actions rapides</h2>
            <Button variant="outline" size="sm" className="text-gray-600 rounded-xl border-gray-200 hover:border-green-500 hover:text-green-600">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div 
              className="group bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent hover:border-green-500 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={handleNewOrder}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Commander</h3>
              <p className="text-sm text-gray-500">Plus de 200 restaurants</p>
            </div>
            
            <div className="group bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent hover:border-red-500 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Favoris</h3>
              <p className="text-sm text-gray-500">Vos restaurants préférés</p>
            </div>
            
            <div className="group bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Promos</h3>
              <p className="text-sm text-gray-500">Offres spéciales</p>
            </div>
            
            <div className="group bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent hover:border-purple-500 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Profil</h3>
              <p className="text-sm text-gray-500">Gérer mon compte</p>
            </div>
          </div>
        </div>

        {/* Onglets redesignés */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4">
              <TabsList className="grid grid-cols-3 w-full bg-gray-100 rounded-2xl p-2">
                <TabsTrigger 
                  value="orders" 
                  className="flex items-center gap-3 rounded-xl px-6 py-4 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-lg font-semibold transition-all"
                >
                  <Clock className="h-5 w-5" />
                  <span>Mes commandes</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="addresses" 
                  className="flex items-center gap-3 rounded-xl px-6 py-4 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-lg font-semibold transition-all"
                >
                  <MapPin className="h-5 w-5" />
                  <span>Adresses</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="flex items-center gap-3 rounded-xl px-6 py-4 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-lg font-semibold transition-all"
                >
                  <History className="h-5 w-5" />
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
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <MapPin className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Gestion des adresses</h3>
                  <p className="text-gray-500 mb-10 max-w-md mx-auto text-lg">Ajoutez et gérez facilement vos adresses de livraison pour une commande encore plus rapide</p>
                  <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                    <Plus className="h-5 w-5 mr-2" />
                    Ajouter une adresse
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <History className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Historique des commandes</h3>
                  <p className="text-gray-500 mb-10 max-w-md mx-auto text-lg">Consultez toutes vos commandes passées et recommandez vos plats favoris</p>
                  <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                    <History className="h-5 w-5 mr-2" />
                    Voir l'historique complet
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Bouton flottant redesigné */}
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={handleNewOrder}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full w-20 h-20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group"
            size="icon"
          >
            <ShoppingBag className="h-8 w-8 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
