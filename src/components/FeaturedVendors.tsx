import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Store, Package, MapPin } from "lucide-react";

export function FeaturedVendors() {
  const vendors = [
    {
      id: 1,
      name: "TechHub Nigeria",
      tier: "Premium",
      description: "Leading electronics and gadgets supplier in Nigeria",
      rating: 4.9,
      products: 2500,
      location: "Lagos",
      avatar: "TH",
      verified: true,
      sales: "₦50M+"
    },
    {
      id: 2,
      name: "Fashion Forward",
      tier: "Standard",
      description: "Trendy African fashion and accessories",
      rating: 4.8,
      products: 850,
      location: "Abuja",
      avatar: "FF",
      verified: true,
      sales: "₦25M+"
    },
    {
      id: 3,
      name: "Home & Garden Plus",
      tier: "Premium",
      description: "Quality home improvement and garden supplies",
      rating: 4.7,
      products: 1200,
      location: "Kano",
      avatar: "HG",
      verified: true,
      sales: "₦30M+"
    },
    {
      id: 4,
      name: "Wellness Store",
      tier: "Basic",
      description: "Natural health and wellness products",
      rating: 4.6,
      products: 320,
      location: "Port Harcourt",
      avatar: "WS",
      verified: false,
      sales: "₦8M+"
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Premium':
        return 'gradient-vendor text-white';
      case 'Standard':
        return 'bg-primary text-primary-foreground';
      case 'Basic':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Vendors</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover top-rated vendors offering quality products with exceptional service across Nigeria
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="group hover:shadow-marketplace-strong transition-smooth cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/api/avatar/${vendor.name}`} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                      {vendor.avatar}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CardTitle className="text-lg">{vendor.name}</CardTitle>
                  {vendor.verified && (
                    <Badge variant="outline" className="text-success border-success">
                      ✓
                    </Badge>
                  )}
                </div>
                
                <Badge className={getTierColor(vendor.tier)}>
                  {vendor.tier} Store
                </Badge>
                
                <CardDescription className="text-center mt-2">
                  {vendor.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Rating */}
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 fill-secondary text-secondary" />
                  <span className="font-semibold">{vendor.rating}</span>
                  <span className="text-muted-foreground text-sm">(500+ reviews)</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.products} products</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.location}</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Monthly Sales</div>
                  <div className="font-bold text-success">{vendor.sales}</div>
                </div>

                <Button 
                  className="w-full group-hover:bg-primary-hover" 
                  variant="default"
                >
                  <Store className="h-4 w-4 mr-2" />
                  Visit Store
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Vendors
          </Button>
        </div>
      </div>
    </section>
  );
}