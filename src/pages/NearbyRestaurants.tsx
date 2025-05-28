
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
      {/* Header moderne */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              <span className="font-medium">Conakry, Guinée</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Rechercher restaurants, plats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline" size="sm" className="px-4 py-3 rounded-xl border-gray-200 hover:border-green-500 hover:text-green-600">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero section pour restaurants */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Restaurants près de vous
              </h1>
              <p className="text-lg text-green-100 mb-4">
                Plus de 200 restaurants disponibles pour la livraison
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-300 mr-1" />
                  <span className="font-semibold">4.8+ étoiles</span>
                </div>
                <div>
                  <span className="font-semibold">25 min</span>
                  <span className="text-green-100 ml-1">livraison moyenne</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="h-10 w-10 text-white" />
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
