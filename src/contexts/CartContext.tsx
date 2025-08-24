import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  vendor_id: string;
  vendor_name: string;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any, quantity: number = 1) => {
    if (product.stock < quantity) {
      toast({
        variant: "destructive",
        title: "Insufficient stock",
        description: `Only ${product.stock} items available`,
      });
      return;
    }

    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast({
            variant: "destructive",
            title: "Insufficient stock",
            description: `Only ${product.stock} items available`,
          });
          return currentItems;
        }
        
        toast({
          title: "Cart updated",
          description: `${product.name} quantity updated to ${newQuantity}`,
        });
        
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart`,
        });
        
        return [...currentItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image_url: product.image_url,
          vendor_id: product.vendor_id,
          vendor_name: product.vendors?.store_name || 'Unknown Vendor',
          stock: product.stock
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(currentItems => {
      const item = currentItems.find(item => item.id === productId);
      if (item) {
        toast({
          title: "Removed from cart",
          description: `${item.name} has been removed from your cart`,
        });
      }
      return currentItems.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems => {
      return currentItems.map(item => {
        if (item.id === productId) {
          if (quantity > item.stock) {
            toast({
              variant: "destructive",
              title: "Insufficient stock",
              description: `Only ${item.stock} items available`,
            });
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}