
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ModernHeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Motifs de fond guinéens */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-secondary-200 rounded-full opacity-30 animate-bounce-gentle"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-accent-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-primary-300 rounded-full opacity-20 animate-bounce-gentle"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          {/* Badge "Nouvelle expérience" */}
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-primary-200 rounded-full px-6 py-2 mb-6 shadow-lg">
            <Star className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-semibold text-primary-600">La nouvelle expérience culinaire guinéenne</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient-guinea">La saveur</span>
            <br />
            <span className="text-gray-900">de la Guinée</span>
            <br />
            <span className="text-primary-600">chez vous</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Découvrez les délices authentiques de notre belle Guinée. 
            Commandez vos plats favoris et savourez la tradition à domicile.
          </p>
          
          {/* Statistiques */}
          <div className="flex justify-center items-center space-x-8 mb-10">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">500+</div>
              <div className="text-sm text-gray-600">Restaurants</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">10K+</div>
              <div className="text-sm text-gray-600">Commandes</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">25 min</div>
              <div className="text-sm text-gray-600">Livraison moyenne</div>
            </div>
          </div>
        </div>

        {/* Barre de recherche moderne */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-2">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Que voulez-vous manger aujourd'hui ?"
                  className="pl-12 pr-4 py-4 border-0 rounded-2xl text-lg focus:ring-0 bg-transparent"
                />
              </div>
              <div className="flex items-center space-x-3 text-gray-500">
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-medium">Conakry</span>
              </div>
              <Button 
                onClick={() => navigate('/nearby-restaurants')}
                className="btn-guinea h-12 px-8 text-lg rounded-2xl"
              >
                Rechercher
              </Button>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
          <Button 
            onClick={() => navigate('/nearby-restaurants')}
            className="btn-guinea h-14 px-8 text-lg rounded-2xl w-full sm:w-auto"
          >
            Explorer les restaurants
          </Button>
          <Button 
            onClick={() => navigate('/auth')}
            variant="outline"
            className="h-14 px-8 text-lg rounded-2xl border-2 border-primary-300 text-primary-600 hover:bg-primary-50 w-full sm:w-auto"
          >
            Créer un compte
          </Button>
        </div>

        {/* Info livraison */}
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <Clock className="h-5 w-5 text-primary-500" />
          <span className="text-sm font-medium">Livraison rapide dans tout Conakry</span>
        </div>
      </div>

      {/* Vague décorative en bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24 text-white" viewBox="0 0 1440 74" fill="currentColor">
          <path d="M0,74L60,69.3C120,65,240,55,360,50.7C480,46,600,46,720,48.7C840,51,960,55,1080,53.3C1200,51,1320,41,1380,36.7L1440,32V74H1380C1320,74,1200,74,1080,74C960,74,840,74,720,74C600,74,480,74,360,74C240,74,120,74,60,74H0Z"/>
        </svg>
      </div>
    </section>
  );
};

export default ModernHeroSection;
