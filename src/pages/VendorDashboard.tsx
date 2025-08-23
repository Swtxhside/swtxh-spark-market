import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { Store, Crown, Zap, Rocket } from "lucide-react";

interface Vendor {
  id: string;
  store_name: string;
  tier: string;
  commission_rate: number;
  subscription_status: string;
}

export default function VendorDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadVendorData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadVendorData(userId: string) {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      setVendor(data);
    } catch (error) {
      console.error("Error loading vendor data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function chooseSubscription(tier: string, rate: number) {
    if (!user) return;
    
    setLoading(true);
    try {
      if (vendor) {
        // Update existing vendor
        const { error } = await supabase
          .from("vendors")
          .update({ tier, commission_rate: rate })
          .eq("user_id", user.id);

        if (error) throw error;
        
        setVendor(prev => prev ? { ...prev, tier, commission_rate: rate } : null);
      } else {
        // Create new vendor record (this will need INSERT policies)
        const storeName = `${user.email?.split('@')[0]}'s Store`;
        const { data, error } = await supabase
          .from("vendors")
          .insert({
            user_id: user.id,
            store_name: storeName,
            tier,
            commission_rate: rate
          })
          .select()
          .single();

        if (error) throw error;
        setVendor(data);
      }

      toast({
        title: "Subscription Updated!",
        description: `You are now on the ${tier} plan with ${rate}% commission rate.`,
      });
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

  if (loading) {
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

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold marketplace-gradient-text mb-2">
              Vendor Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your store and subscription plan
            </p>
          </div>

          {vendor && (
            <Card className="mb-8 shadow-marketplace">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Store className="h-5 w-5" />
                  <span>{vendor.store_name}</span>
                </CardTitle>
                <CardDescription>
                  Current Plan: <Badge variant="secondary">{vendor.tier}</Badge> | 
                  Commission Rate: {vendor.commission_rate}%
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-primary" />
                <span>Subscription Plans</span>
              </CardTitle>
              <CardDescription>
                Choose the perfect plan for your business needs
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
                          onClick={() => chooseSubscription(plan.name, plan.rate)}
                          variant={plan.popular ? "hero" : "outline"}
                          className="w-full"
                          disabled={loading || vendor?.tier === plan.name}
                        >
                          {vendor?.tier === plan.name ? "Current Plan" : `Choose ${plan.name}`}
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