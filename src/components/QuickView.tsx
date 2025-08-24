import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart, Eye, Minus, Plus, Star, Share2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/components/Wishlist';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  vendors: { store_name: string };
}

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  if (!product) return null;

  // Generate multiple images for demo (in real app, these would come from product data)
  const images = [
    product.image_url,
    product.image_url, // In real app, these would be different angles/variations
    product.image_url,
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this product: ${product.name}`,
        url: window.location.origin + `/products/${product.id}`,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(
        window.location.origin + `/products/${product.id}`
      );
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      });
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Thumbnails */}
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === index 
                      ? 'border-primary' 
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-2xl">{product.name}</DialogTitle>
              <DialogDescription className="text-base">
                Sold by <span className="font-medium">{product.vendors.store_name}</span>
              </DialogDescription>
            </DialogHeader>

            {/* Rating (Demo) */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 fill-secondary text-secondary"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.8) • 324 reviews</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                ₦{product.price.toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    In Stock ({product.stock} available)
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Out of Stock
                  </Badge>
                )}
                
                <Badge variant="outline">
                  Free Shipping over ₦50,000
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <span className="text-sm text-muted-foreground">
                  Total: ₦{(product.price * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddToWishlist}
                  className={isInWishlist(product.id) ? 'bg-red-50 text-red-600' : ''}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </Button>
                
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  onClose();
                  window.location.href = `/products/${product.id}`;
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Full Details
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
              <div className="flex justify-between">
                <span>SKU:</span>
                <span>#{product.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span>Electronics</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>3-5 business days</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}