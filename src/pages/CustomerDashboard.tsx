import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Package, Heart, User, LogOut } from "lucide-react";

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate("/auth/customer");
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth/customer");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  const dashboardItems = [
    {
      title: "Browse Products",
      description: "Discover amazing products from trusted vendors",
      icon: ShoppingBag,
      action: () => navigate("/products"),
      buttonText: "Start Shopping"
    },
    {
      title: "My Orders",
      description: "Track your orders and purchase history",
      icon: Package,
      action: () => {}, // TODO: Implement orders page
      buttonText: "View Orders"
    },
    {
      title: "Wishlist",
      description: "Save your favorite items for later",
      icon: Heart,
      action: () => {}, // TODO: Implement wishlist
      buttonText: "View Wishlist"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-feature rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back!
              </h1>
              <p className="text-muted-foreground">
                {user.email}
              </p>
              <Badge variant="secondary" className="mt-2">
                Customer Account
              </Badge>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardItems.map((item, index) => (
            <Card key={index} className="shadow-marketplace hover:shadow-marketplace-strong transition-smooth">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <item.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                <CardDescription>
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={item.action}
                >
                  {item.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <Card className="shadow-marketplace">
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>Your shopping activity at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">₦0</div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">0</div>
                <div className="text-sm text-muted-foreground">Wishlist Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">0</div>
                <div className="text-sm text-muted-foreground">Reviews Given</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}