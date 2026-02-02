import { Dish } from './types';

const API_BASE_URL = 'https://restaurant.stepprojects.ge/api';

export async function fetchDishes(): Promise<Dish[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/Products/GetAll`);
    if (!response.ok) {
      throw new Error('Failed to fetch dishes');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return [];
  }
}

export async function fetchDishesByCategory(category: string): Promise<Dish[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/Products/GetByType?type=${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch dishes by category');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dishes by category:', error);
    return [];
  }
}
