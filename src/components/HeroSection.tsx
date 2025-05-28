
import { MapPin, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Votre nourriture
            <br />
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              livrée en 30 min
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez les meilleurs restaurants de votre ville et commandez vos plats préférés 
            en quelques clics. Livraison rapide et sécurisée.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary-500" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">30 min</p>
                <p className="text-sm text-gray-600">Livraison moyenne</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-secondary-500" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                <p className="text-sm text-gray-600">Note moyenne</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary-500" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-gray-600">Restaurants</p>
              </div>
            </div>
          </div>

          <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 text-lg">
            Commander maintenant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
