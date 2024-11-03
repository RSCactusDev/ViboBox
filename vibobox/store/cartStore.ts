// stores/cartStore.ts
import { create } from 'zustand';
import axios from 'axios';

interface CartItem {
  variant: string;
  color: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addItemToCart: (item: CartItem) => Promise<void>;
  removeItemFromCart: (variant: string, color: string) => Promise<void>;
  fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],

  // Fetch cart from the server (on page load)
  fetchCart: async () => {
    try {
      const response = await axios.get('/api/cart');
      set({ cart: response.data.cart.items || []});
    } catch (error) {
      console.error('Error fetching cart:', error);
      set({ cart: [] });
    }
  },

  // Add item to cart and sync with the server
  addItemToCart: async (item: CartItem) => {
    try {
      // Optimistically update the local state
      set((state) => ({
        cart: [...state.cart, item],
      }));

      // Sync with the server
      await axios.post('/api/cart/add', item);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  },

  // Remove item from cart and sync with the server
  removeItemFromCart: async (variant: string, color: string) => {
    try {
      // Optimistically update the local state
      set((state) => ({
        cart: state.cart.filter(
          (item) => !(item.variant === variant && item.color === color)
        ),
      }));

      // Sync with the server
      await axios.post('/api/cart/remove', { variant, color });
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  },
}));
