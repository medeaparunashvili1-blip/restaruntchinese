import { useState, useEffect } from 'react';
import { ShoppingCart, UtensilsCrossed } from 'lucide-react';
import DishesPage from './DishesPage';
import CartPage from './CartPage';
import { cartStore } from './cartStore';

type Page = 'dishes' | 'cart';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dishes');
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    setCartItemCount(cartStore.getItemCount());
    const unsubscribe = cartStore.subscribe(() => {
      setCartItemCount(cartStore.getItemCount());
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={32} className="text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-800">Restaurant</h1>
            </div>

            <nav className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage('dishes')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'dishes'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Menu
              </button>

              <button
                onClick={() => setCurrentPage('cart')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 relative ${
                  currentPage === 'cart'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ShoppingCart size={20} />
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {currentPage === 'dishes' ? <DishesPage /> : <CartPage />}
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>Online Restaurant - Delicious food delivered to your door</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
