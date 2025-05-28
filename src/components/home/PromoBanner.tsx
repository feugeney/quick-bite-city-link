
import React from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PromoBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative p-8 md:p-12">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/20 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                  <Gift className="h-6 w-6 text-gray-900" />
                </div>
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Offre limitée
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Livraison gratuite
                <span className="block text-yellow-300">pour votre 1ère commande</span>
              </h2>
              
              <p className="text-lg text-purple-100 mb-6">
                Découvrez nos restaurants partenaires et profitez de la livraison offerte dès maintenant !
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center text-white">
                  <Clock className="h-5 w-5 mr-2 text-yellow-300" />
                  <span>Livraison en 25 min</span>
                </div>
                <div className="flex items-center text-white">
                  <Star className="h-5 w-5 mr-2 text-yellow-300" />
                  <span>Service 5 étoiles</span>
                </div>
              </div>
              
              <Button 
                onClick={() => navigate('/nearby')}
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Commander maintenant
              </Button>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center">
                    <Gift className="h-24 w-24 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
