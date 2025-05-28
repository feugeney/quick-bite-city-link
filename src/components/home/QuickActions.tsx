
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Coffee, Pizza, Truck, Gift, Star } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: ShoppingBag,
      title: 'Restaurants',
      subtitle: 'Cuisine locale',
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      action: () => navigate('/nearby')
    },
    {
      icon: Coffee,
      title: 'Café & Thé',
      subtitle: 'Boissons chaudes',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      action: () => navigate('/nearby')
    },
    {
      icon: Pizza,
      title: 'Fast Food',
      subtitle: 'Livraison rapide',
      color: 'from-red-400 to-pink-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      action: () => navigate('/nearby')
    },
    {
      icon: Truck,
      title: 'Express',
      subtitle: 'En 15 min',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      action: () => navigate('/nearby')
    },
    {
      icon: Gift,
      title: 'Promos',
      subtitle: 'Offres spéciales',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      action: () => navigate('/nearby')
    },
    {
      icon: Star,
      title: 'Top Rated',
      subtitle: 'Les mieux notés',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      action: () => navigate('/nearby')
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          Que souhaitez-vous commander ?
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <div 
                key={index}
                onClick={action.action}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className={`${action.bgColor} rounded-2xl p-6 text-center border-2 border-transparent group-hover:border-gray-200 group-hover:shadow-lg transition-all`}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`font-bold ${action.textColor} mb-1`}>{action.title}</h3>
                  <p className="text-xs text-gray-500">{action.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
