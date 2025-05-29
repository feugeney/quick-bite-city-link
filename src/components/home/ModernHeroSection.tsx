
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Star, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ModernHeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 guinea-pattern overflow-hidden">
      {/* Motifs décoratifs - responsive */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-20 h-20 sm:w-32 sm:h-32 bg-primary-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-10 sm:right-20 w-16 h-16 sm:w-24 sm:h-24 bg-secondary-100 rounded-full opacity-30 animate-bounce-gentle"></div>
        <div className="absolute bottom-20 sm:bottom-32 left-1/4 w-12 h-12 sm:w-20 sm:h-20 bg-accent-100 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-8 h-8 sm:w-16 sm:h-16 bg-primary-200 rounded-full opacity-15 animate-bounce-gentle"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          {/* Contenu principal - responsive */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8">
            {/* Badge d'introduction */}
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-primary-200 shadow-lg">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-500 mr-2" />
              <span className="text-primary-700 font-semibold text-sm sm:text-base">#1 en Guinée</span>
            </div>

            {/* Titre principal */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-gradient-guinea">La saveur</span><br />
                <span className="text-gray-900">de la Guinée</span><br />
                <span className="text-primary-600">à votre porte</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Découvrez les délices authentiques de la cuisine guinéenne avec une livraison rapide et fiable dans tout Conakry.
              </p>
            </div>

            {/* Statistiques rapides - responsive */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 py-6 sm:py-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600">500+</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Restaurants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-600">25min</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Livraison</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent-600">10k+</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Clients</div>
              </div>
            </div>

            {/* Boutons d'action - responsive */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4">
              <Button 
                onClick={() => navigate('/auth')}
                className="btn-guinea h-12 sm:h-16 px-6 sm:px-10 text-base sm:text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                Commander maintenant
              </Button>
              <Button 
                onClick={() => navigate('/nearby-restaurants')}
                variant="outline"
                className="h-12 sm:h-16 px-6 sm:px-10 text-base sm:text-lg font-semibold rounded-2xl border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 group"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:text-primary-600" />
                Voir les restaurants
              </Button>
            </div>

            {/* Informations de livraison - responsive */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 pt-6 sm:pt-8">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500" />
                <span className="font-medium text-sm sm:text-base">Disponible à Conakry</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-secondary-500" />
                <span className="font-medium text-sm sm:text-base">Ouvert 24h/7</span>
              </div>
            </div>
          </div>

          {/* Section visuelle - responsive */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Image principale simulée avec des couleurs guinéennes */}
              <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-3xl lg:rounded-[3rem] shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-500">
                <div className="text-center text-white">
                  <div className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-2 sm:mb-4">🍽️</div>
                  <div className="text-lg sm:text-2xl lg:text-3xl font-bold">Cuisine Guinéenne</div>
                  <div className="text-sm sm:text-base lg:text-lg opacity-90 mt-2">Authentique & Délicieuse</div>
                </div>
              </div>

              {/* Cartes flottantes - responsive */}
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl border border-gray-100 animate-bounce-gentle">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900">4.9</div>
                    <div className="text-xs sm:text-sm text-gray-600">Évaluation</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl border border-gray-100 animate-pulse">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900">25min</div>
                    <div className="text-xs sm:text-sm text-gray-600">Livraison</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -left-8 sm:-left-12 bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl border border-gray-100 animate-bounce-gentle">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🚚</div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-700">Livraison gratuite</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernHeroSection;
