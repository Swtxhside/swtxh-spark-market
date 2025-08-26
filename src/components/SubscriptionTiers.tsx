import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Store, Users, TrendingUp, Shield, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SubscriptionTiers() {
  const navigate = useNavigate();

  const platformFeatures = [
    { icon: ShoppingBag, title: "Seamless Shopping", description: "Browse thousands of products with our intuitive interface" },
    { icon: Store, title: "Trusted Vendors", description: "Shop from verified merchants across Nigeria" },
    { icon: Shield, title: "Secure Payments", description: "Your transactions are protected with enterprise-grade security" },
    { icon: TrendingUp, title: "Best Prices", description: "Competitive pricing with exclusive deals and discounts" },
  ];

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <Badge className="mb-4 gradient-hero text-white px-6 py-2">
            <Star className="h-4 w-4 mr-2" />
            Nigeria's Premier E-Commerce Platform
          </Badge>
          
          <h2 className="text-4xl font-bold mb-6">
            Where Commerce Meets Innovation
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Welcome to Swtxh Side Innovation Marketplace – Nigeria's fastest-growing multi-vendor platform that connects 
            passionate entrepreneurs with discerning customers. Experience the future of e-commerce with cutting-edge 
            technology, unmatched security, and endless opportunities for growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {platformFeatures.map((feature, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-marketplace transition-smooth">
              <CardContent className="p-0">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Join Our Growing Community</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're looking to discover amazing products or build your dream business, 
              Swtxh Side Innovation is your gateway to endless possibilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Customer Section */}
            <Card className="text-center p-8 hover:shadow-marketplace-strong transition-smooth">
              <CardContent className="p-0">
                <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="h-10 w-10 text-secondary" />
                </div>
                <h4 className="text-xl font-semibold mb-4">For Shoppers</h4>
                <p className="text-muted-foreground mb-6">
                  Discover thousands of products from trusted vendors. Enjoy secure payments, 
                  fast delivery, and exceptional customer service.
                </p>
                <div className="space-y-3">
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="w-full"
                    onClick={() => navigate('/auth/customer')}
                  >
                    Sign Up to Shop
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full"
                    onClick={() => navigate('/auth/customer')}
                  >
                    Customer Login
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Section */}
            <Card className="text-center p-8 hover:shadow-marketplace-strong transition-smooth">
              <CardContent className="p-0">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Store className="h-10 w-10 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-4">For Vendors</h4>
                <p className="text-muted-foreground mb-6">
                  Turn your passion into profit. Reach millions of customers, grow your brand, 
                  and build a sustainable business with our powerful vendor tools.
                </p>
                <div className="space-y-3">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="w-full"
                    onClick={() => navigate('/auth/vendor')}
                  >
                    Become a Vendor
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full"
                    onClick={() => navigate('/auth/vendor')}
                  >
                    Vendor Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>1,200+ Active Vendors</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span>50,000+ Products</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>100% Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}