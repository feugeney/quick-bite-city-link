
import React, { useState } from 'react';
import { Search, MapPin, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const ModernHeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('/nearby');
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-green-500 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-300/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Tout ce dont vous avez
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              envie, livré
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Découvrez les meilleurs restaurants de Conakry et faites-vous livrer en quelques minutes
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-4 py-3 bg-gray-50 rounded-xl flex-1">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700 font-medium">Conakry, Guinée</span>
                </div>
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Restaurant, plat, cuisine..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 pr-4 py-3 border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-900"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Rechercher
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-gray-900" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">25 min</h3>
              <p className="text-blue-100">Livraison moyenne</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-gray-900" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">200+</h3>
              <p className="text-blue-100">Restaurants partenaires</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-gray-900" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">5 km</h3>
              <p className="text-blue-100">Rayon de livraison</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHeroSection;
