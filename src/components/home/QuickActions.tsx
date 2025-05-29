
import React from 'react';
import { Button } from '@/components/ui/button';
import { Truck, Clock, Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Truck,
      title: "Livraison Express",
      description: "En 25 minutes",
      color: "primary",
      gradient: "from-primary-500 to-primary-600"
    },
    {
      icon: Star,
      title: "Cuisine Locale",
      description: "Plats authentiques",
      color: "secondary",
      gradient: "from-secondary-500 to-secondary-600"
    },
    {
      icon: Clock,
      title: "Ouvert 24h/7",
      description: "Toujours disponible",
      color: "accent",
      gradient: "from-accent-500 to-accent-600"
    },
    {
      icon: MapPin,
      title: "Tout Conakry",
      description: "Zone de livraison",
      color: "primary",
      gradient: "from-primary-600 to-primary-700"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir <span className="text-gradient-guinea">NimbaExpress</span> ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une expérience culinaire unique qui célèbre la richesse de la gastronomie guinéenne
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200 hover:-translate-y-2"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 font-medium">{action.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/auth')}
            className="btn-guinea h-14 px-8 text-lg rounded-2xl"
          >
            Commencer maintenant
          </Button>
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
