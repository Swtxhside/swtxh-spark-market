import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Store, Crown, Zap, Rocket, ShoppingBag, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface Vendor {
  id: string;
  store_name: string;
  tier: string;
  commission_rate: number;
  subscription_status: string;
}

export default function VendorDashboard() {
  const { user, vendor, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const hasActiveSubscription = vendor?.subscription_status === 'active';

  async function updateSubscription(tier: string, rate: number) {
    if (!user || !vendor) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("vendors")
        .update({ 
          tier, 
          commission_rate: rate,
          subscription_status: 'active' // Activate subscription
        })
        .eq("user_id", user.id);

      if (error) throw error;
        
      toast({
        title: "Subscription Activated!",
        description: `You are now on the ${tier} plan. Your vendor features are now unlocked!`,
      });
      
      // Refresh the page to update context
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Subscription Update Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }


  if (authLoading || loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-16 text-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-8">Please login to access the vendor dashboard.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const subscriptionPlans = [
    {
      name: "Basic",
      price: "₦5,000",
      rate: 8.0,
      icon: Store,
      description: "Perfect for starting vendors",
      features: ["Basic store features", "Standard support", "8% commission rate"],
      color: "secondary"
    },
    {
      name: "Standard",
      price: "₦10,000", 
      rate: 5.0,
      icon: Zap,
      description: "Most popular choice",
      features: ["Advanced analytics", "Priority support", "5% commission rate"],
      color: "success",
      popular: true
    },
    {
      name: "Premium",
      price: "₦20,000",
      rate: 3.0,
      icon: Rocket,
      description: "For established businesses",
      features: ["Premium features", "24/7 support", "3% commission rate"],
      color: "primary"
    }
  ];

  // Show subscription plans if no active subscription
  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold marketplace-gradient-text mb-2">
                🚀 Welcome Vendor!
              </h1>
              <p className="text-muted-foreground">
                To unlock your shop and start selling, please subscribe to a plan.
              </p>
            </div>

            <Card className="shadow-marketplace">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <span>Choose Your Subscription Plan</span>
                </CardTitle>
                <CardDescription>
                  Select the perfect plan to start your selling journey
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan) => {
                    const Icon = plan.icon;
                    return (
                      <Card 
                        key={plan.name} 
                        className={`relative shadow-marketplace transition-smooth hover:shadow-marketplace-strong ${
                          plan.popular ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        {plan.popular && (
                          <Badge 
                            className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground"
                          >
                            Most Popular
                          </Badge>
                        )}
                        
                        <CardHeader className="text-center">
                          <div className="mx-auto mb-4">
                            <Icon className="h-8 w-8 text-primary" />
                          </div>
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                          <div className="text-2xl font-bold text-primary">
                            {plan.price}<span className="text-sm font-normal text-muted-foreground">/month</span>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="text-center">
                          <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                            {plan.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                          
                          <Button
                            onClick={() => updateSubscription(plan.name, plan.rate)}
                            variant={plan.popular ? "hero" : "outline"}
                            className="w-full"
                            disabled={loading}
                          >
                            Choose {plan.name}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Active subscription dashboard
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold marketplace-gradient-text mb-2">
              Vendor Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Manage your store and track your performance.
            </p>
          </div>

          {/* Current Plan Info */}
          <Card className="mb-8 shadow-marketplace">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="h-5 w-5" />
                <span>{vendor?.store_name}</span>
              </CardTitle>
              <CardDescription>
                Current Plan: <Badge variant="secondary">{vendor?.tier}</Badge> | 
                Commission Rate: {vendor?.commission_rate}%
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-marketplace hover:shadow-marketplace-strong transition-smooth">
              <CardContent className="p-6">
                <Link to="/vendor/storefront" className="block">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">My Shop</h3>
                      <p className="text-sm text-muted-foreground">View your storefront</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-marketplace hover:shadow-marketplace-strong transition-smooth">
              <CardContent className="p-6">
                <Link to="/vendor/products" className="block">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Manage Products</h3>
                      <p className="text-sm text-muted-foreground">Add & edit products</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-marketplace hover:shadow-marketplace-strong transition-smooth">
              <CardContent className="p-6">
                <Link to="/orders" className="block">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Orders</h3>
                      <p className="text-sm text-muted-foreground">View customer orders</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-marketplace hover:shadow-marketplace-strong transition-smooth">
              <CardContent className="p-6">
                <Link to="/vendor/earnings" className="block">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Earnings</h3>
                      <p className="text-sm text-muted-foreground">Track your revenue</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Change Plan Section */}
          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-primary" />
                <span>Upgrade Your Plan</span>
              </CardTitle>
              <CardDescription>
                Want better rates or more features? Choose a different plan.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => {
                  const Icon = plan.icon;
                  const isCurrentPlan = vendor?.tier === plan.name;
                  return (
                    <Card 
                      key={plan.name} 
                      className={`relative shadow-marketplace transition-smooth hover:shadow-marketplace-strong ${
                        isCurrentPlan ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                    >
                      {isCurrentPlan && (
                        <Badge 
                          className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground"
                        >
                          Current Plan
                        </Badge>
                      )}
                      
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-4">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="text-2xl font-bold text-primary">
                          {plan.price}<span className="text-sm font-normal text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="text-center">
                        <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                          {plan.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                        
                        <Button
                          onClick={isCurrentPlan ? undefined : () => updateSubscription(plan.name, plan.rate)}
                          variant={isCurrentPlan ? "secondary" : "outline"}
                          className="w-full"
                          disabled={loading || isCurrentPlan}
                        >
                          {isCurrentPlan ? "Current Plan" : `Switch to ${plan.name}`}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}