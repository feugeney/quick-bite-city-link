
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import PublicHomepage from '@/components/PublicHomepage';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-guinea-subtle guinea-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
            <span className="text-white font-bold text-lg sm:text-2xl">N</span>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">Chargement...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated AND has a confirmed session, redirect to appropriate dashboard
  if (user && user.email_confirmed_at) {
    return <Navigate to="/dashboard" />;
  }

  // Show public homepage for non-authenticated users or users with unconfirmed accounts
  return <PublicHomepage />;
};

export default Index;
