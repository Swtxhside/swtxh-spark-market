import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Plus, 
  Package, 
  Edit,
  Trash2,
  ImagePlus,
  AlertTriangle
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  vendor_id: string;
  created_at: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  image_url: string;
}

export default function VendorProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: ""
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadVendorData();
    }
  }, [user]);

  const loadVendorData = async () => {
    try {
      // Get vendor info
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (vendorError) throw vendorError;
      setVendor(vendorData);

      // Get vendor products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("vendor_id", vendorData.id)
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (error: any) {
      console.error("Error loading vendor data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load vendor data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vendor) return;

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image_url: formData.image_url,
        vendor_id: vendor.id
      };

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;

        toast({
          title: "Product Updated",
          description: "Your product has been successfully updated.",
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Product Created",
          description: "Your new product has been added to your store.",
        });
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      setFormData({ name: "", description: "", price: "", stock: "", image_url: "" });
      loadVendorData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      toast({
        title: "Product Deleted",
        description: "Product has been removed from your store.",
      });

      loadVendorData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-16 text-center">
          <p>Loading your products...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold marketplace-gradient-text mb-2">
                Product Management
              </h1>
              <p className="text-muted-foreground">
                Manage your store inventory and listings
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="shadow-marketplace"
                  onClick={() => {
                    setEditingProduct(null);
                    setFormData({ name: "", description: "", price: "", stock: "", image_url: "" });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProduct ? "Update your product details" : "Create a new product listing"}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your product"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price (₦)</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stock</label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Image URL</label>
                    <Input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingProduct ? "Update Product" : "Add Product"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <Card className="shadow-marketplace">
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first product to your store
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="shadow-marketplace hover:shadow-marketplace-strong transition-smooth">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    
                    {product.stock <= 5 && product.stock > 0 && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Low Stock
                      </Badge>
                    )}
                    
                    {product.stock === 0 && (
                      <Badge variant="secondary" className="absolute top-2 left-2">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
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
                        {product.stock} in stock
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}