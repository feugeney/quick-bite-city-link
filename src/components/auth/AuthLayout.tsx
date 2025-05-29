
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Star } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  onCreateAdminAccount: () => void;
}

const AuthLayout = ({ children, onCreateAdminAccount }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-guinea-subtle guinea-pattern relative overflow-hidden">
      {/* Motifs décoratifs - optimisés pour mobile */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-primary-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-4 sm:right-20 w-10 h-10 sm:w-16 sm:h-16 bg-secondary-100 rounded-full opacity-30 animate-bounce-gentle"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-accent-100 rounded-full opacity-25 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center py-4 sm:py-8 px-3 sm:px-4 lg:px-8 min-h-screen">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Logo et titre avec design guinéen - responsive */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl relative">
                <span className="text-white font-bold text-2xl sm:text-3xl">N</span>
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-secondary-400 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient-guinea mb-2 sm:mb-3">NimbaExpress</h1>
            <p className="text-gray-600 text-base sm:text-lg font-medium px-2">La saveur de la Guinée à votre porte</p>
            <div className="mt-2 sm:mt-3 flex items-center justify-center space-x-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-secondary-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-accent-500 rounded-full"></div>
            </div>
          </div>

          {/* Bouton admin - responsive */}
          <div className="text-center mb-4 sm:mb-6 px-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onCreateAdminAccount}
              className="text-xs bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100 rounded-xl mb-2 px-4 py-2"
            >
              <Shield className="w-3 h-3 mr-2" />
              Créer compte administrateur
            </Button>
            <div className="text-xs text-gray-500 px-2 leading-relaxed">
              Email: admin@nimbaexpress.com<br />
              Mot de passe: AdminNimba2024!
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
