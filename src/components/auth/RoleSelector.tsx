
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Truck, Store } from 'lucide-react';

type Role = 'client' | 'livreur' | 'restaurant_owner';

interface RoleSelectorProps {
  onRoleSelect: (role: Role) => void;
}

const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  const roleConfig = {
    client: {
      icon: Users,
      title: "Client",
      description: "Commander des repas délicieux",
      color: "text-primary-500",
      bgColor: "hover:bg-primary-50 hover:border-primary-200 border-2",
      gradient: "from-primary-50 to-primary-100"
    },
    livreur: {
      icon: Truck,
      title: "Livreur",
      description: "Livrer avec NimbaExpress",
      color: "text-accent-500", 
      bgColor: "hover:bg-accent-50 hover:border-accent-200 border-2",
      gradient: "from-accent-50 to-accent-100"
    },
    restaurant_owner: {
      icon: Store,
      title: "Propriétaire",
      description: "Développer votre restaurant",
      color: "text-secondary-600",
      bgColor: "hover:bg-secondary-50 hover:border-secondary-200 border-2",
      gradient: "from-secondary-50 to-secondary-100"
    }
  };

  return (
    <Card className="card-guinea border-0 shadow-2xl">
      <CardHeader className="space-y-1 pb-4 sm:pb-6 text-center px-4 sm:px-6">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">Rejoignez-nous</CardTitle>
        <CardDescription className="text-gray-600 text-base sm:text-lg">
          Choisissez votre aventure culinaire
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
            Rejoignez la famille NimbaExpress
          </h3>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {Object.entries(roleConfig).map(([role, config]) => {
            const Icon = config.icon;
            return (
              <Button
                key={role}
                variant="outline"
                className={`w-full h-16 sm:h-20 flex items-center justify-start space-x-4 sm:space-x-6 ${config.bgColor} transition-all duration-300 hover:scale-105 p-3 sm:p-4`}
                onClick={() => onRoleSelect(role as Role)}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br ${config.gradient} ${config.color} shadow-lg`}>
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-base sm:text-lg text-gray-900">{config.title}</div>
                  <div className="text-sm text-gray-600">{config.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleSelector;
