
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Pizza, Coffee, IceCream, Salad, Soup, Cake } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

const CategoryGrid = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Icons mapping for categories
  const iconMap: { [key: string]: any } = {
    'Pizza': Pizza,
    'Café': Coffee,
    'Desserts': IceCream,
    'Salade': Salad,
    'Soupe': Soup,
    'Gâteau': Cake,
  };

  // Default icons for fallback
  const defaultIcons = [Pizza, Coffee, IceCream, Salad, Soup, Cake];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .limit(6);

        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }

        setCategories(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Catégories populaires</h2>
            <p className="text-gray-600">Explorez nos différentes catégories de cuisine</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show default categories if no data
  const displayCategories = categories.length > 0 ? categories : [
    { id: '1', name: 'Pizza' },
    { id: '2', name: 'Café' },
    { id: '3', name: 'Desserts' },
    { id: '4', name: 'Salade' },
    { id: '5', name: 'Soupe' },
    { id: '6', name: 'Gâteau' }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Catégories populaires</h2>
          <p className="text-gray-600">Explorez nos différentes catégories de cuisine</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {displayCategories.map((category, index) => {
            const IconComponent = iconMap[category.name] || defaultIcons[index % defaultIcons.length];
            return (
              <div 
                key={category.id}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                    <IconComponent className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
