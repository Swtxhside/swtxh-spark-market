import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "@/lib/supabaseApi";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/components/Wishlist";
import { ProductReviews } from "@/components/ProductReviews";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    async function fetchProduct() {
      if (id) {
        const data = await getProductById(id);
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Link to="/products">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-marketplace"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground mb-4">{product.description}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">₦{product.price}</span>
                {product.stock > 0 ? (
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    In Stock ({product.stock} available)
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Out of Stock
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground mb-6">
                Sold by: <span className="font-medium">{product.vendors?.store_name}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full"
                disabled={product.stock === 0}
                variant="hero"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full"
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}