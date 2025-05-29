
import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">N</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gradient-guinea bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                NimbaExpress
              </span>
            </div>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 max-w-md leading-relaxed">
              Votre partenaire de confiance pour découvrir les saveurs authentiques de la Guinée. 
              Livraison rapide et fiable dans tout Conakry.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary-600 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-secondary-500 transition-colors">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-accent-600 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-accent-500 transition-colors">
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Liens rapides</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Accueil</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Restaurants</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Devenir livreur</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Devenir partenaire</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">À propos</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Contact</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-center text-gray-300 text-sm sm:text-base">
                <MapPin className="w-4 h-4 mr-2 sm:mr-3 text-primary-400 flex-shrink-0" />
                <span>Conakry, Guinée</span>
              </li>
              <li className="flex items-center text-gray-300 text-sm sm:text-base">
                <Phone className="w-4 h-4 mr-2 sm:mr-3 text-secondary-400 flex-shrink-0" />
                <span>+224 000 00 00 00</span>
              </li>
              <li className="flex items-center text-gray-300 text-sm sm:text-base">
                <Mail className="w-4 h-4 mr-2 sm:mr-3 text-accent-400 flex-shrink-0" />
                <span>contact@nimbaexpress.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2024 NimbaExpress. Tous droits réservés.
            </p>
            <div className="flex space-x-4 sm:space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
