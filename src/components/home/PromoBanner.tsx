
import React from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PromoBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50 guinea-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Motifs décoratifs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-200 rounded-full opacity-30 animate-bounce-gentle"></div>
          
          <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 px-8 py-16 md:px-16 md:py-20">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-white">
                  <div className="flex items-center space-x-2 mb-6">
                    <Gift className="w-6 h-6 text-secondary-300" />
                    <span className="text-secondary-300 font-semibold text-lg">Offre Spéciale</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    Première commande
                    <br />
                    <span className="text-secondary-300">-20% de réduction</span>
                  </h2>
                  
                  <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                    Découvrez les saveurs authentiques de la Guinée avec notre promotion de bienvenue. 
                    Plus de 200 plats traditionnels vous attendent !
                  </p>
                  
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button 
                      onClick={() => navigate('/auth')}
                      className="bg-white text-primary-600 hover:bg-gray-100 h-14 px-8 text-lg font-semibold rounded-2xl"
                    >
                      Profiter de l'offre
                    </Button>
                    <Button 
                      onClick={() => navigate('/nearby-restaurants')}
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 h-14 px-8 text-lg font-semibold rounded-2xl"
                    >
                      Voir les restaurants
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-6 mt-8 pt-8 border-t border-white/20">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-secondary-300" />
                      <span className="text-primary-100">Livraison en 25 min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-secondary-300" />
                      <span className="text-primary-100">+500 restaurants</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-full h-80 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <div className="text-center text-white">
                      <div className="text-6xl font-bold mb-4">20%</div>
                      <div className="text-xl font-semibold">DE RÉDUCTION</div>
                      <div className="text-secondary-100 mt-2">Sur votre première commande</div>
                    </div>
                  </div>
                  
                  {/* Éléments décoratifs flottants */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent-400 rounded-full opacity-80 animate-bounce-gentle"></div>
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-secondary-300 rounded-full opacity-60 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
