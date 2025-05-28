
import Footer from '@/components/Footer';
import LocationAwareRestaurants from '@/components/location/LocationAwareRestaurants';

const NearbyRestaurants = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Restaurants à proximité
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez les restaurants près de chez vous
          </p>
        </div>
        
        <LocationAwareRestaurants />
      </main>
      
      <Footer />
    </div>
  );
};

export default NearbyRestaurants;
