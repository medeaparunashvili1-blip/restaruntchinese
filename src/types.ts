export interface Dish {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  spiciness: number;
  hasNuts: boolean;
  isVegetarian: boolean;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}

export type Category =
  | 'Salads'
  | 'Soups'
  | 'Chicken-Dishes'
  | 'Beef-Dishes'
  | 'Seafood-Dishes'
  | 'Vegetable-Dishes'
  | 'Bits&Bites'
  | 'On-The-Side';
