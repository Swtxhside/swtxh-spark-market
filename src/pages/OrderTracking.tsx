import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  MapPin
} from "lucide-react";

interface Order {
  id: string;
  buyer_id: string;
  vendor_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
  vendor?: {
    store_name: string;
  };
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products?: {
    name: string;
    image_url: string;
  };
}

const orderStatuses = [
  { key: 'pending', label: 'Order Placed', icon: Clock, color: 'secondary' },
  { key: 'processing', label: 'Processing', icon: Package, color: 'warning' },
  { key: 'shipped', label: 'Shipped', icon: Truck, color: 'info' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'success' }
];

export default function OrderTracking() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingId, setTrackingId] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (name, image_url)
          ),
          vendors (store_name)
        `)
        .eq("buyer_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error loading orders:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your orders",
      });
    } finally {
      setLoading(false);
    }
  };

  const trackOrder = async () => {
    if (!trackingId.trim()) return;

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (name, image_url)
          ),
          vendors (store_name)
        `)
        .eq("id", trackingId.trim())
        .single();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Order Not Found",
          description: "Please check your tracking ID and try again",
        });
        return;
      }

      // Check if user owns this order or if it's a public tracking
      if (data.buyer_id !== user?.id) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You can only track your own orders",
        });
        return;
      }

      // Scroll to the specific order
      const orderElement = document.getElementById(`order-${trackingId}`);
      if (orderElement) {
        orderElement.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error: any) {
      console.error("Error tracking order:", error);
    }
  };

  const getStatusIndex = (status: string) => {
    return orderStatuses.findIndex(s => s.key === status);
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const statusObj = orderStatuses.find(s => s.key === status);
    switch (statusObj?.color) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-16 text-center">
          <p>Loading your orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold marketplace-gradient-text mb-2">
              Track Your Orders
            </h1>
            <p className="text-muted-foreground">
              Monitor your order status and delivery progress
            </p>
          </div>

          {/* Order Tracking Search */}
          <Card className="shadow-marketplace mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Quick Track</span>
              </CardTitle>
              <CardDescription>
                Enter your order ID to quickly find and track a specific order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Order ID (e.g., ORD-123456)"
                  className="flex-1"
                />
                <Button onClick={trackOrder}>
                  <Search className="h-4 w-4 mr-2" />
                  Track
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          {orders.length === 0 ? (
            <Card className="shadow-marketplace">
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start shopping to see your orders here
                </p>
                <Button onClick={() => window.location.href = "/products"}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const currentStatusIndex = getStatusIndex(order.status);
                
                return (
                  <Card key={order.id} id={`order-${order.id}`} className="shadow-marketplace">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            Order #{order.id.slice(0, 8)}
                          </CardTitle>
                          <CardDescription>
                            From {order.vendor?.store_name} • {new Date(order.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {orderStatuses.find(s => s.key === order.status)?.label || order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {/* Order Progress */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          {orderStatuses.map((status, index) => {
                            const Icon = status.icon;
                            const isCompleted = index <= currentStatusIndex;
                            const isCurrent = index === currentStatusIndex;
                            
                            return (
                              <div key={status.key} className="flex flex-col items-center flex-1">
                                <div className={`
                                  w-10 h-10 rounded-full flex items-center justify-center mb-2
                                  ${isCompleted 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-muted text-muted-foreground'
                                  }
                                  ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}
                                `}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <span className={`text-sm text-center ${
                                  isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'
                                }`}>
                                  {status.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="relative">
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted transform -translate-y-1/2" />
                          <div 
                            className="absolute top-1/2 left-0 h-0.5 bg-primary transform -translate-y-1/2 transition-all duration-300"
                            style={{ width: `${(currentStatusIndex / (orderStatuses.length - 1)) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                            {item.products?.image_url && (
                              <img 
                                src={item.products.image_url} 
                                alt={item.products.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{item.products?.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ₦{item.price.toLocaleString()}
                              </p>
                            </div>
                            <span className="font-semibold">
                              ₦{(item.quantity * item.price).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order Total */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">Estimated delivery: 3-5 business days</span>
                        </div>
                        <div className="text-lg font-bold">
                          Total: ₦{order.total_amount.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}