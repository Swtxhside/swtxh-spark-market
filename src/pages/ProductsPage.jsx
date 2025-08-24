import { Link } from "react-router-dom";
import { getAllProducts } from '@/lib/supabaseApi';
import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ProductSearch } from "@/components/ProductSearch";
import { QuickView } from "@/components/QuickView";
import { ArrowLeft, Eye, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/components/Wishlist";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getAllProducts();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg shadow-marketplace overflow-hidden hover:shadow-lg transition-smooth">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-3">
                <h2 className="font-bold text-lg">{product.name}</h2>
                <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold text-lg">₦{product.price}</span>
                  <span className="text-xs text-muted-foreground">{product.vendors?.store_name}</span>
                </div>
                <Link to={`/products/${product.id}`} className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}