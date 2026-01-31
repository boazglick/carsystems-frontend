import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WooCommerceProduct } from '@/types/product';

export interface VariationInfo {
  id: number;
  price: string;
  attributes: {
    name: string;
    option: string;
  }[];
}

export interface CartItem {
  product: WooCommerceProduct;
  quantity: number;
  variation?: VariationInfo;
}

// Generate unique cart key for product + variation combo
const getCartItemKey = (productId: number, variationId?: number): string => {
  return variationId ? `${productId}-${variationId}` : `${productId}`;
};

interface CartStore {
  items: CartItem[];
  addItem: (product: WooCommerceProduct, quantity?: number, variation?: VariationInfo) => void;
  removeItem: (productId: number, variationId?: number) => void;
  updateQuantity: (productId: number, quantity: number, variationId?: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getItem: (productId: number, variationId?: number) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, variation) => {
        set((state) => {
          const itemKey = getCartItemKey(product.id, variation?.id);
          const existingItem = state.items.find(
            (item) => getCartItemKey(item.product.id, item.variation?.id) === itemKey
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                getCartItemKey(item.product.id, item.variation?.id) === itemKey
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity, variation }],
          };
        });
      },

      removeItem: (productId, variationId) => {
        const itemKey = getCartItemKey(productId, variationId);
        set((state) => ({
          items: state.items.filter(
            (item) => getCartItemKey(item.product.id, item.variation?.id) !== itemKey
          ),
        }));
      },

      updateQuantity: (productId, quantity, variationId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variationId);
          return;
        }

        const itemKey = getCartItemKey(productId, variationId);
        set((state) => ({
          items: state.items.map((item) =>
            getCartItemKey(item.product.id, item.variation?.id) === itemKey
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        const items = get().items;
        return items.reduce((total, item) => {
          // Use variation price if available, otherwise product price
          const price = item.variation
            ? parseFloat(item.variation.price)
            : parseFloat(item.product.price);
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        const items = get().items;
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getItem: (productId, variationId) => {
        const itemKey = getCartItemKey(productId, variationId);
        return get().items.find(
          (item) => getCartItemKey(item.product.id, item.variation?.id) === itemKey
        );
      },
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
    }
  )
);
