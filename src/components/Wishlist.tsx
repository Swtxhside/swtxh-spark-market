import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Heart, ShoppingCart, X, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  stock: number;
  vendor_name: string;
}

export function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      // Load from localStorage for demo (in real app, sync with backend)
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = (product: any) => {
    const newItem: WishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      stock: product.stock,
      vendor_name: product.vendors?.store_name || 'Unknown Vendor'
    };

    setWishlistItems(current => {
      const exists = current.find(item => item.id === product.id);
      if (exists) return current;
      
      const updated = [...current, newItem];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
      
      return updated;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(current => {
      const item = current.find(item => item.id === productId);
      const updated = current.filter(item => item.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      
      if (item) {
        toast({
          title: "Removed from wishlist",
          description: `${item.name} has been removed from your wishlist`,
        });
      }
      
      return updated;
    });
  };

  const moveToCart = (item: WishlistItem) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('wishlist');
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist",
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  if (loading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading wishlist...</p>
      </div>
    );
  }

  return {
    component: (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Wishlist ({wishlistItems.length})</h2>
          {wishlistItems.length > 0 && (
            <Button variant="outline" onClick={clearWishlist}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-4">
                Save items you love to your wishlist and never lose them.
              </p>
              <Link to="/products">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-marketplace-strong transition-smooth">
                <CardContent className="p-4">
                  <div className="relative">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">by {item.vendor_name}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        ₦{item.price.toLocaleString()}
                      </span>
                      {item.stock > 0 ? (
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => moveToCart(item)}
                        disabled={item.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Link to={`/products/${item.id}`} className="flex-1">
                        <Button variant="ghost" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    ),
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    wishlistItems
  };
}

// Export hook for easy usage
export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  }, []);

  const addToWishlist = (product: any) => {
    setWishlistItems(current => {
      const exists = current.find(item => item.id === product.id);
      if (exists) {
        toast({
          title: "Already in wishlist",
          description: "This item is already in your wishlist",
        });
        return current;
      }
      
      const newItem: WishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        stock: product.stock,
        vendor_name: product.vendors?.store_name || 'Unknown Vendor'
      };
      
      const updated = [...current, newItem];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
      
      return updated;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(current => {
      const item = current.find(item => item.id === productId);
      const updated = current.filter(item => item.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      
      if (item) {
        toast({
          title: "Removed from wishlist",
          description: `${item.name} has been removed from your wishlist`,
        });
      }
      
      return updated;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
}