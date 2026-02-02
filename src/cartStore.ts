import { Dish, CartItem } from './types';

class CartStore {
  private items: CartItem[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    const savedCart = localStorage.getItem('restaurantCart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener());
    localStorage.setItem('restaurantCart', JSON.stringify(this.items));
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  addItem(dish: Dish) {
    const existingItem = this.items.find(item => item.dish.id === dish.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ dish, quantity: 1 });
    }
    this.notify();
  }

  updateQuantity(dishId: number, quantity: number) {
    const item = this.items.find(item => item.dish.id === dishId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(dishId);
      } else {
        item.quantity = quantity;
        this.notify();
      }
    }
  }

  removeItem(dishId: number) {
    this.items = this.items.filter(item => item.dish.id !== dishId);
    this.notify();
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.dish.price * item.quantity), 0);
  }

  getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart() {
    this.items = [];
    this.notify();
  }
}

export const cartStore = new CartStore();
