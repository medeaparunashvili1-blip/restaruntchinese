import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartItem } from './types';
import { cartStore } from './cartStore';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(cartStore.getItems());
    const unsubscribe = cartStore.subscribe(() => {
      setCartItems(cartStore.getItems());
    });
    return unsubscribe;
  }, []);

  const handleQuantityChange = (dishId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    cartStore.updateQuantity(dishId, newQuantity);
  };

  const handleRemove = (dishId: number) => {
    if (confirm('Remove this item from cart?')) {
      cartStore.removeItem(dishId);
    }
  };

  const handleClearCart = () => {
    if (confirm('Clear all items from cart?')) {
      cartStore.clearCart();
    }
  };

  const total = cartStore.getTotal();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">Your cart is empty</p>
          <p className="text-gray-500 mt-2">Add some delicious dishes to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div
              key={item.dish.id}
              className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4"
            >
              <img
                src={item.dish.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200'}
                alt={item.dish.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.dish.name}</h3>
                <p className="text-gray-600">${item.dish.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(item.dish.id, item.quantity - 1)}
                  className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <Minus size={16} />
                </button>

                <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>

                <button
                  onClick={() => handleQuantityChange(item.dish.id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  ${(item.dish.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => handleRemove(item.dish.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span>{cartStore.getItemCount()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${(total * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
