
import { MapPin, Bell, User, LogOut, Shield, Menu, Car, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './notifications/NotificationBell';
import { useAutoLocation } from '@/hooks/useAutoLocation';

const Header = () => {
  const { user, signOut } = useAuth();
  const [userRole, setUserRole] = useState<string>('client');
  const navigate = useNavigate();
  const location = useLocation();
  const { location: currentLocation, loading: locationLoading } = useAutoLocation();
  
  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setUserRole(data.role);
        }
      }
    };
    
    checkUserRole();
  }, [user]);

  const hideHeader = ['/auth'].includes(location.pathname);
  
  if (hideHeader) {
    return null;
  }

  const getInitials = () => {
    if (!user) return 'U';
    const name = `${user.user_metadata.first_name || ''} ${user.user_metadata.last_name || ''}`.trim();
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isAdmin = userRole === 'admin';
  const isRestaurantOwner = userRole === 'restaurant_owner';
  const isDeliveryPerson = userRole === 'livreur';
  const isClient = userRole === 'client';

  const getRoleSpecificMenuItems = () => {
    const baseItems = [
      { to: "/profile", icon: User, label: "Profil" }
    ];

    if (isClient) {
      baseItems.push({ to: "/orders", icon: Store, label: "Mes commandes" });
      baseItems.push({ to: "/delivery-registration", icon: Car, label: "Devenir livreur" });
    }

    if (isDeliveryPerson) {
      baseItems.push({ to: "/delivery-dashboard", icon: Car, label: "Tableau de bord livreur" });
    }

    if (isRestaurantOwner) {
      baseItems.push({ to: "/restaurant-dashboard", icon: Store, label: "Gérer mon restaurant" });
    }

    if (isAdmin) {
      baseItems.push({ to: "/admin", icon: Shield, label: "Administration" });
    }

    return baseItems;
  };

  const getLocationDisplay = () => {
    if (locationLoading) {
      return (
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="h-4 w-4 text-green-600 animate-pulse" />
          <span className="text-sm font-medium">Localisation...</span>
        </div>
      );
    }

    if (currentLocation) {
      return (
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">Conakry, Guinée</span>
          <span className="text-xs text-gray-400 hidden lg:inline">
            ({currentLocation.lat.toFixed(3)}, {currentLocation.lng.toFixed(3)})
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <MapPin className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium">Conakry, Guinée</span>
      </div>
    );
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              NimbaExpress
            </span>
          </Link>

          {/* Location - Now displayed on all pages */}
          <div className="hidden md:flex">
            {getLocationDisplay()}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <NotificationBell />
                
                {/* Role-specific buttons */}
                {isDeliveryPerson && (
                  <Button variant="outline" size="sm" className="hidden md:flex border-green-200 hover:border-green-500 rounded-full" asChild>
                    <Link to="/delivery-dashboard">
                      <Car className="h-4 w-4 mr-2" />
                      Livraisons
                    </Link>
                  </Button>
                )}

                {isRestaurantOwner && (
                  <Button variant="outline" size="sm" className="hidden md:flex border-orange-200 hover:border-orange-500 rounded-full" asChild>
                    <Link to="/restaurant-dashboard">
                      <Store className="h-4 w-4 mr-2" />
                      Mon restaurant
                    </Link>
                  </Button>
                )}
                
                {isAdmin && (
                  <Button variant="outline" size="sm" className="hidden md:flex border-red-200 hover:border-red-500 rounded-full" asChild>
                    <Link to="/admin">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-50" size="icon">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border border-gray-100">
                    <DropdownMenuLabel className="text-gray-900 font-semibold">
                      Mon compte
                      <div className="text-xs text-gray-500 font-normal mt-1">
                        {userRole === 'admin' && 'Administrateur'}
                        {userRole === 'restaurant_owner' && 'Propriétaire'}
                        {userRole === 'livreur' && 'Livreur'}
                        {userRole === 'client' && 'Client'}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {getRoleSpecificMenuItems().map((item) => (
                      <DropdownMenuItem key={item.to} asChild className="rounded-lg mx-2 my-1 hover:bg-gray-50 cursor-pointer">
                        <Link to={item.to} className="w-full flex items-center">
                          <item.icon className="h-4 w-4 mr-3 text-gray-500" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="rounded-lg mx-2 my-1 hover:bg-red-50 text-red-600 cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full" asChild>
                  <Link to="/auth?tab=register">Commencer</Link>
                </Button>
                <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:border-green-500" asChild>
                  <Link to="/auth">Se connecter</Link>
                </Button>
              </>
            )}
            
            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="md:hidden hover:bg-gray-50 rounded-full">
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
        
        {/* Mobile location display */}
        <div className="md:hidden pb-3 border-t border-gray-100 pt-3">
          {getLocationDisplay()}
        </div>
      </div>
    </header>
  );
};

export default Header;
