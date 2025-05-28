
import React from 'react';
import ModernHeroSection from './home/ModernHeroSection';
import QuickActions from './home/QuickActions';
import CategoryGrid from './CategoryGrid';
import RestaurantGrid from './RestaurantGrid';
import PromoBanner from './home/PromoBanner';
import Footer from './Footer';

const PublicHomepage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeroSection />
      <QuickActions />
      <CategoryGrid />
      <PromoBanner />
      <RestaurantGrid />
      <Footer />
    </div>
  );
};

export default PublicHomepage;
