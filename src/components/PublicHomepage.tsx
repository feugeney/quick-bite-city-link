
import React from 'react';
import HeroSection from './HeroSection';
import CategoryGrid from './CategoryGrid';
import RestaurantGrid from './RestaurantGrid';
import AdvertisementBanner from './AdvertisementBanner';
import Footer from './Footer';

const PublicHomepage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <CategoryGrid />
      <AdvertisementBanner />
      <RestaurantGrid />
      <Footer />
    </div>
  );
};

export default PublicHomepage;
