import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star, TrendingUp, Zap } from "lucide-react";

export function SubscriptionTiers() {
  const tiers = [
    {
      name: "Basic Store",
      price: "₦5,000",
      period: "/month",
      description: "Perfect for small businesses starting their online journey",
      commission: "8%",
      icon: Star,
      features: [
        "20 product uploads",
        "Basic store page design",
        "Standard customer support",
        "Mobile-responsive storefront",
        "Basic analytics dashboard",
        "Payment processing integration"
      ],
      buttonText: "Start Basic",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Standard Store",
      price: "₦10,000",
      period: "/month",
      description: "Ideal for growing businesses with enhanced features",
      commission: "5%",
      icon: TrendingUp,
      features: [
        "100 product uploads",
        "Featured store placement",
        "Advanced analytics dashboard",
        "Priority customer support",
        "Custom store branding",
        "Promotional campaigns",
        "Inventory management tools",
        "Customer review system"
      ],
      buttonText: "Choose Standard",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Premium Store",
      price: "₦20,000",
      period: "/month",
      description: "For established businesses seeking maximum growth",
      commission: "3%",
      icon: Zap,
      features: [
        "Unlimited product uploads",
        "Homepage promotion slots",
        "Premium customer support",
        "Advanced analytics & insights",
        "Custom domain support",
        "API access for integrations",
        "Bulk import/export tools",
        "Dedicated account manager",
        "Priority in search results",
        "Advanced marketing tools"
      ],
      buttonText: "Go Premium",
      buttonVariant: "premium" as const,
      popular: false
    }
  ];

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Store Plan</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start selling on Swtxh Side Innovation with flexible pricing plans designed for every business size
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <Card 
              key={index} 
              className={`relative transition-smooth hover:shadow-marketplace-strong ${
                tier.popular ? 'ring-2 ring-primary shadow-marketplace-strong' : ''
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 gradient-hero text-white px-6 py-1">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${tier.popular ? 'gradient-hero' : 'bg-primary'}`}>
                    <tier.icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="mt-2">{tier.description}</CardDescription>

                <div className="mt-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground ml-1">{tier.period}</span>
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    {tier.commission} commission rate
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-success shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={tier.buttonVariant}
                  size="lg" 
                  className="w-full"
                >
                  {tier.buttonText}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  30-day free trial • No setup fees • Cancel anytime
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 p-8 gradient-feature rounded-xl">
          <h3 className="text-xl font-semibold mb-2">Need a Custom Solution?</h3>
          <p className="text-muted-foreground mb-4">
            Contact our sales team for enterprise plans and volume discounts
          </p>
          <Button variant="default">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
}