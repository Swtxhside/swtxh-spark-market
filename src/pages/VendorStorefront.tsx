import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { 
  Store,
  MapPin,
  Globe,
  Star,
  ShoppingCart,
  Package
} from "lucide-react";

interface Vendor {
  id: string;
  store_name: string;
  tier: string;
  subscription_status: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  vendor_id: string;
}

export default function VendorStorefront() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    if (vendorId) {
      loadVendorData();
    }
  }, [vendorId]);

  const loadVendorData = async () => {
    try {
      // Load vendor info (only public storefront data - no sensitive business intelligence)
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("id, store_name, tier, subscription_status, created_at")
        .eq("id", vendorId)
        .eq("subscription_status", "active")
        .single();

      if (vendorError) throw vendorError;
      setVendor(vendorData);

      // Load vendor products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("vendor_id", vendorId)
        .gt("stock", 0)
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (error: any) {
      console.error("Error loading vendor data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load vendor store",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
      vendor: vendor ? {
        id: vendor.id,
        store_name: vendor.store_name
      } : undefined,
      stock: product.stock
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-16 text-center">
          <p>Loading store...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Store Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The store you're looking for doesn't exist or is not active.
          </p>
          <Button onClick={() => window.location.href = "/products"}>
            Browse All Products
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      {/* Store Hero Section */}
      <section className="bg-gradient-primary py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">{vendor.store_name}</h1>
            <p className="text-xl opacity-90 mb-2">Premium Marketplace Store</p>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Star className="h-3 w-3 mr-1" />
                {vendor.tier} Vendor
              </Badge>
              <span className="text-white/80">
                Member since {new Date(vendor.created_at).getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Store Info */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-1">
              <Card className="shadow-marketplace sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Store className="h-5 w-5" />
                    <span>Store Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      <Package className="h-4 w-4 inline mr-1" />
                      {products.length} Products Available
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Products</h2>
                <span className="text-muted-foreground">
                  {products.length} items available
                </span>
              </div>

              {products.length === 0 ? (
                <Card className="shadow-marketplace">
                  <CardContent className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Products Available</h3>
                    <p className="text-muted-foreground">
                      This store currently has no products in stock.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="shadow-marketplace hover:shadow-marketplace-strong transition-smooth group">
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {product.description || "No description available"}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-primary">
                            ₦{product.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {product.stock} left
                          </span>
                        </div>
                        
                        <Button 
                          className="w-full shadow-marketplace"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}