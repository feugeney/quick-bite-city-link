import LocationTracker from './delivery/LocationTracker';
import CurrentDelivery from './delivery/CurrentDelivery';
import AvailableOrders from './delivery/AvailableOrders';
import { useDeliveryDashboard } from '@/hooks/useDeliveryDashboard';
import { MapPin, Package, Clock, TrendingUp, Navigation, DollarSign, Star, Target } from 'lucide-react';

const DeliveryDashboard = () => {
  const {
    availableOrders,
    currentDelivery,
    loading,
    acceptOrder,
    completeDelivery,
  } = useDeliveryDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
            <Package className="h-10 w-10 text-white" />
          </div>
          <p className="text-gray-600 text-lg font-medium">Chargement de votre dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* En-tête moderne avec gradient */}
        <div className="relative mb-8 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Dashboard Livreur 🚀
                </h1>
                <p className="text-green-100 text-lg">
                  Gérez vos livraisons à Conakry en temps réel
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Navigation className="h-5 w-5" />
                <span className="text-sm font-medium">En ligne</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats rapides redesignées */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">En cours</p>
                <p className="text-3xl font-bold text-gray-900">{currentDelivery ? 1 : 0}</p>
                <p className="text-xs text-green-600 font-medium">Livraison active</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Disponibles</p>
                <p className="text-3xl font-bold text-gray-900">{availableOrders.length}</p>
                <p className="text-xs text-orange-600 font-medium">À accepter</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Aujourd'hui</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
                <p className="text-xs text-blue-600 font-medium">Livraisons</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Gains</p>
                <p className="text-3xl font-bold text-gray-900">85k</p>
                <p className="text-xs text-purple-600 font-medium">GNF</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Tracker de localisation redesigné */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Localisation</h2>
                  <p className="text-gray-600">Votre position actuelle</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <LocationTracker />
            </div>
          </div>

          {/* Livraison en cours redesignée */}
          {currentDelivery && (
            <div className="bg-white rounded-3xl shadow-xl border border-blue-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-6 border-b border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Navigation className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Livraison en cours</h2>
                    <p className="text-blue-600 font-medium">Course active</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <CurrentDelivery 
                  currentDelivery={currentDelivery}
                  onCompleteDelivery={completeDelivery}
                />
              </div>
            </div>
          )}

          {/* Commandes disponibles redesignées */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Commandes disponibles</h2>
                    <p className="text-gray-600">{availableOrders.length} commandes à proximité</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-green-100 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">En ligne</span>
                </div>
              </div>
            </div>
            <div className="p-8">
              <AvailableOrders 
                availableOrders={availableOrders}
                currentDelivery={currentDelivery}
                onAcceptOrder={acceptOrder}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeliveryDashboard;
