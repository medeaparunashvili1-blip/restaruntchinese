import { useState, useEffect } from 'react';
import { Flame, Nut, Leaf } from 'lucide-react';
import { Dish, Category } from './types';
import { fetchDishes, fetchDishesByCategory } from './api';
import DishCard from './DishCard';

const CATEGORIES: Category[] = [
  'Salads',
  'Soups',
  'Chicken-Dishes',
  'Beef-Dishes',
  'Seafood-Dishes',
  'Vegetable-Dishes',
  'Bits&Bites',
  'On-The-Side',
];

export default function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [spiciness, setSpiciness] = useState<number | null>(null);
  const [hasNuts, setHasNuts] = useState<boolean | null>(null);
  const [isVegetarian, setIsVegetarian] = useState<boolean | null>(null);

  useEffect(() => {
    loadDishes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [dishes, selectedCategory, spiciness, hasNuts, isVegetarian]);

  const loadDishes = async () => {
    setLoading(true);
    const data = await fetchDishes();
    setDishes(data);
    setLoading(false);
  };

  const loadDishesByCategory = async (category: string) => {
    setLoading(true);
    if (category === 'All') {
      await loadDishes();
    } else {
      const data = await fetchDishesByCategory(category);
      setDishes(data);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...dishes];

    if (spiciness !== null) {
      filtered = filtered.filter(dish => dish.spiciness === spiciness);
    }

    if (hasNuts !== null) {
      filtered = filtered.filter(dish => dish.hasNuts === hasNuts);
    }

    if (isVegetarian !== null) {
      filtered = filtered.filter(dish => dish.isVegetarian === isVegetarian);
    }

    setFilteredDishes(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    loadDishesByCategory(category);
  };

  const resetFilters = () => {
    setSpiciness(null);
    setHasNuts(null);
    setIsVegetarian(null);
    setSelectedCategory('All');
    loadDishes();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Our Menu</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('All')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Flame className="inline mr-1" size={16} />
              Spiciness Level
            </label>
            <select
              value={spiciness === null ? '' : spiciness}
              onChange={(e) => setSpiciness(e.target.value === '' ? null : Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Any</option>
              <option value="0">No Spice (0)</option>
              <option value="1">Mild (1)</option>
              <option value="2">Medium (2)</option>
              <option value="3">Hot (3)</option>
              <option value="4">Extra Hot (4)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Nut className="inline mr-1" size={16} />
              Contains Nuts
            </label>
            <select
              value={hasNuts === null ? '' : hasNuts.toString()}
              onChange={(e) => setHasNuts(e.target.value === '' ? null : e.target.value === 'true')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Any</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Leaf className="inline mr-1" size={16} />
              Vegetarian
            </label>
            <select
              value={isVegetarian === null ? '' : isVegetarian.toString()}
              onChange={(e) => setIsVegetarian(e.target.value === '' ? null : e.target.value === 'true')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Any</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <button
          onClick={resetFilters}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading dishes...</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">{filteredDishes.length} dishes found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDishes.map(dish => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
          {filteredDishes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No dishes found matching your filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
