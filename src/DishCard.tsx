import { Flame, Nut, Leaf, ShoppingCart } from 'lucide-react';
import { Dish } from './types';
import { cartStore } from './cartStore';

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const handleAddToCart = () => {
    cartStore.addItem(dish);
    alert('Added to cart!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={dish.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
        alt={dish.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{dish.name}</h3>

        <div className="flex items-center gap-3 mb-3">
          {dish.spiciness > 0 && (
            <div className="flex items-center gap-1">
              {[...Array(dish.spiciness)].map((_, i) => (
                <Flame key={i} size={16} className="text-red-500" />
              ))}
            </div>
          )}

          {dish.hasNuts && (
            <div className="flex items-center gap-1 text-amber-600">
              <Nut size={16} />
            </div>
          )}

          {dish.isVegetarian && (
            <div className="flex items-center gap-1 text-green-600">
              <Leaf size={16} />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${dish.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ShoppingCart size={18} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
