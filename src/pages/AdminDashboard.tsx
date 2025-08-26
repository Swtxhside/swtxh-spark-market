import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Store, 
  Package, 
  TrendingUp, 
  DollarSign,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalRevenue: number;
  pendingVendors: number;
}

interface Vendor {
  id: string;
  user_id: string;
  store_name: string;
  tier: string;
  commission_rate: number;
  subscription_status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load statistics
      const [usersResult, vendorsResult, productsResult] = await Promise.all([
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("vendors").select("*"),
        supabase.from("products").select("id", { count: "exact", head: true })
      ]);

      const totalUsers = usersResult.count || 0;
      const totalVendors = vendorsResult.data?.length || 0;
      const totalProducts = productsResult.count || 0;
      const pendingVendors = vendorsResult.data?.filter(v => v.subscription_status === 'pending').length || 0;

      setStats({
        totalUsers,
        totalVendors,
        totalProducts,
        totalRevenue: 150000, // Calculate from actual transactions
        pendingVendors
      });

      setVendors(vendorsResult.data || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveVendor = async (vendorId: string) => {
    try {
      const { error } = await supabase
        .from("vendors")
        .update({ subscription_status: 'active' })
        .eq("id", vendorId);

      if (error) throw error;

      toast({
        title: "Vendor Approved",
        description: "Vendor has been successfully approved and activated.",
      });

      loadDashboardData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const suspendVendor = async (vendorId: string) => {
    try {
      const { error } = await supabase
        .from("vendors")
        .update({ subscription_status: 'suspended' })
        .eq("id", vendorId);

      if (error) throw error;

      toast({
        title: "Vendor Suspended",
        description: "Vendor has been suspended from the platform.",
      });

      loadDashboardData();
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
          <p>Loading admin dashboard...</p>
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold marketplace-gradient-text mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your marketplace platform
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-marketplace hover:shadow-marketplace-strong transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {stats?.totalUsers?.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-marketplace hover:shadow-marketplace-strong transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {stats?.totalVendors?.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-marketplace hover:shadow-marketplace-strong transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  {stats?.totalProducts?.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-marketplace hover:shadow-marketplace-strong transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold marketplace-gradient-text">
                  ₦{stats?.totalRevenue?.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="vendors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="vendors">Vendor Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="products">Product Control</TabsTrigger>
              <TabsTrigger value="settings">Platform Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="vendors" className="space-y-6">
              <Card className="shadow-marketplace">
                <CardHeader>
                  <CardTitle>Vendor Applications</CardTitle>
                  <CardDescription>
                    Review and manage vendor registrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vendors.map((vendor) => (
                      <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">{vendor.store_name}</h3>
                          <p className="text-sm text-muted-foreground">Vendor ID: {vendor.id.slice(0, 8)}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={vendor.subscription_status === 'active' ? "default" : "secondary"}>
                              {vendor.subscription_status}
                            </Badge>
                            <Badge variant="outline">{vendor.tier}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {vendor.commission_rate}% commission
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          
                          {vendor.subscription_status === 'active' ? (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => suspendVendor(vendor.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Suspend
                            </Button>
                          ) : (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => approveVendor(vendor.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card className="shadow-marketplace">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Platform Analytics</span>
                  </CardTitle>
                  <CardDescription>
                    Track marketplace performance and growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Analytics dashboard coming soon...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <Card className="shadow-marketplace">
                <CardHeader>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>
                    Monitor and control marketplace products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Product management tools coming soon...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="shadow-marketplace">
                <CardHeader>
                  <CardTitle>Platform Configuration</CardTitle>
                  <CardDescription>
                    Manage subscription pricing and commission rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Platform settings interface coming soon...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}