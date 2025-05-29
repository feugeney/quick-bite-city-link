
import Footer from '@/components/Footer';
import LocationAwareRestaurants from '@/components/location/LocationAwareRestaurants';
import { ArrowLeft, MapPin, Filter, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NearbyRestaurants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderne - responsive */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 sm:top-16 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-green-600" />
              <span className="font-medium text-sm sm:text-base">Conakry, Guinée</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Rechercher restaurants, plats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 sm:pl-4 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-50 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <Button variant="outline" size="sm" className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-gray-200 hover:border-green-500 hover:text-green-600 text-sm sm:text-base">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Filtres</span>
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Hero section pour restaurants - responsive */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Restaurants près de vous
              </h1>
              <p className="text-base sm:text-lg text-green-100 mb-3 sm:mb-4">
                Plus de 200 restaurants disponibles pour la livraison
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300 mr-1" />
                  <span className="font-semibold text-sm sm:text-base">4.8+ étoiles</span>
                </div>
                <div className="text-sm sm:text-base">
                  <span className="font-semibold">25 min</span>
                  <span className="text-green-100 ml-1">livraison moyenne</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <LocationAwareRestaurants />
      </main>
      
      <Footer />
    </div>
  );
};

export default NearbyRestaurants;
