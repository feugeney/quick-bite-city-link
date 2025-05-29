
import { MapPin, Mail, Phone, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold">NimbaExpress</span>
            </Link>
            <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
              La plateforme de livraison qui célèbre la richesse culinaire de la Guinée. 
              Savourez l'authenticité, commandez la tradition.
            </p>
            <div className="flex items-center space-x-2 text-secondary-400">
              <Heart className="w-5 h-5" />
              <span className="font-medium">Fait avec amour en Guinée</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-xl mb-6 text-gradient-guinea">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Conakry, Guinée</div>
                  <div className="text-gray-400 text-sm">Quartier Kaloum</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">+224 XX XX XX XX</div>
                  <div className="text-gray-400 text-sm">Service client 24h/7</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">contact@nimbaexpress.com</div>
                  <div className="text-gray-400 text-sm">Support rapide</div>
                </div>
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-bold text-xl mb-6 text-gradient-guinea">Liens rapides</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/auth" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 font-medium">
                  Mon compte
                </Link>
              </li>
              <li>
                <Link to="/auth?tab=register" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 font-medium">
                  Inscription
                </Link>
              </li>
              <li>
                <Link to="/nearby-restaurants" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 font-medium">
                  Restaurants
                </Link>
              </li>
              <li>
                <span className="text-gray-300 hover:text-primary-400 transition-colors duration-200 font-medium cursor-pointer">
                  Devenir partenaire
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparateur avec motif */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} NimbaExpress. Tous droits réservés.</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-secondary-400" />
                <span className="text-gray-400 text-sm">Une expérience 5 étoiles</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
                <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
