import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Users, TrendingUp, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-marketplace.jpg";

export function HeroSection() {
  const navigate = useNavigate();
  
  const stats = [
    { icon: Users, label: "Active Vendors", value: "1,200+" },
    { icon: ShoppingBag, label: "Products Listed", value: "50,000+" },
    { icon: TrendingUp, label: "Monthly Sales", value: "₦500M+" },
    { icon: Shield, label: "Secure Transactions", value: "99.9%" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img 
          src={heroImage}
          alt="Swtxh Side Innovation Marketplace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero opacity-90" />
      </div>

      {/* Hero Content */}
      <div className="relative container py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-white/30">
              Nigeria's Premier Multi-Vendor Marketplace
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Your Gateway to
              <br />
              <span className="text-secondary">Endless Commerce</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-lg">
              Connect with thousands of trusted vendors, discover amazing products, 
              and grow your business on Nigeria's fastest-growing e-commerce platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                variant="secondary" 
                size="xl"
                onClick={() => navigate('/auth/customer')}
              >
                Start Shopping
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => navigate('/auth/vendor')}
              >
                Become a Vendor
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-secondary mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <p className="text-sm text-white/80">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}