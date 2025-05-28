
import { MapPin, Clock, User, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DeliveryTracker = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Suivi en temps réel
          </h2>
          <p className="text-lg text-gray-600">
            Restez informé à chaque étape de votre commande
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            {/* Order Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Commande #1234
                </h3>
                <p className="text-gray-600">Chez Fatou - Thiéboudienne + Bissap</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-500">8 500 FCFA</p>
                <p className="text-sm text-gray-500">Arrivée estimée: 15 min</p>
              </div>
            </div>

            {/* Delivery Steps */}
            <div className="relative">
              <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gray-200"></div>
              <div className="absolute left-6 top-12 h-24 w-0.5 bg-primary-500"></div>
              
              <div className="space-y-8">
                {/* Step 1 - Completed */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Commande confirmée</h4>
                    <p className="text-sm text-gray-600">Le restaurant prépare votre commande</p>
                    <p className="text-xs text-gray-400">14:32</p>
                  </div>
                </div>

                {/* Step 2 - Completed */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Commande prête</h4>
                    <p className="text-sm text-gray-600">En attente du livreur</p>
                    <p className="text-xs text-gray-400">14:45</p>
                  </div>
                </div>

                {/* Step 3 - Current */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center animate-pulse-custom">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">En cours de livraison</h4>
                    <p className="text-sm text-gray-600">Amadou se dirige vers vous</p>
                    <p className="text-xs text-primary-500 font-medium">Maintenant</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Appeler
                  </Button>
                </div>

                {/* Step 4 - Pending */}
                <div className="flex items-center space-x-4 opacity-50">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Livraison</h4>
                    <p className="text-sm text-gray-600">Votre commande sera livrée</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Amadou D.</p>
                    <p className="text-sm text-gray-600">Livreur depuis 2 ans • ⭐ 4.9</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Distance restante</p>
                  <p className="font-semibold text-gray-900">0.8 km</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DeliveryTracker;
