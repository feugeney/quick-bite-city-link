
import { MapPin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">NimbaExpress</span>
            </Link>
            <p className="mt-4 text-gray-500">
              Livraison de repas rapide et efficace à Conakry, Guinée.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-gray-500">
                <MapPin className="h-5 w-5 text-primary-500 mt-0.5" />
                <span>Conakry, Guinée</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-500">
                <Phone className="h-5 w-5 text-primary-500" />
                <span>+224 XX XX XX XX</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-500">
                <Mail className="h-5 w-5 text-primary-500" />
                <span>contact@nimbaexpress.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Liens</h3>
            <ul className="space-y-2 text-gray-500">
              <li>
                <Link to="/auth" className="hover:text-primary-500">Mon compte</Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-primary-500">Inscription</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} NimbaExpress. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
