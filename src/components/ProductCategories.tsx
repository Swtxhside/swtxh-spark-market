import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Smartphone, 
  Watch, 
  Headphones, 
  Home, 
  ChefHat, 
  Lightbulb,
  Zap,
  Battery,
  Car,
  Bike,
  Gamepad2, 
  Dumbbell,
  Shirt,
  Wheat,
  Plane,
  Monitor,
  Sofa,
  Bot,
  Sun,
  Wrench,
  Trophy,
  Gift,
  Cpu,
  Speaker,
  Camera
} from "lucide-react";

export function ProductCategories() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const categories = [
    { name: "Tech & Electronics", icon: Monitor, count: "15,200+", color: "bg-blue-500" },
    { name: "Smartphones & Accessories", icon: Smartphone, count: "8,900+", color: "bg-purple-500" },
    { name: "Smartwatches & Wearables", icon: Watch, count: "3,400+", color: "bg-pink-500" },
    { name: "Drones & Gadgets", icon: Plane, count: "1,800+", color: "bg-indigo-500" },
    { name: "Audio & Home Theater", icon: Headphones, count: "4,600+", color: "bg-green-500" },
    { name: "Home & Living", icon: Home, count: "7,200+", color: "bg-orange-500" },
    { name: "Furniture", icon: Sofa, count: "2,800+", color: "bg-amber-500" },
    { name: "Kitchen Appliances", icon: ChefHat, count: "3,900+", color: "bg-red-500" },
    { name: "Cleaning Devices", icon: Bot, count: "1,500+", color: "bg-cyan-500" },
    { name: "Smart Lighting & Solar", icon: Lightbulb, count: "2,300+", color: "bg-yellow-500" },
    { name: "Energy & Power", icon: Zap, count: "1,900+", color: "bg-emerald-500" },
    { name: "Solar Panels", icon: Sun, count: "800+", color: "bg-orange-400" },
    { name: "Inverters & Batteries", icon: Battery, count: "1,200+", color: "bg-blue-600" },
    { name: "Vehicles & Mobility", icon: Car, count: "2,100+", color: "bg-slate-500" },
    { name: "Bikes & E-Bikes", icon: Bike, count: "1,400+", color: "bg-green-600" },
    { name: "Gaming & VR", icon: Gamepad2, count: "3,200+", color: "bg-purple-600" },
    { name: "Fitness Equipment", icon: Dumbbell, count: "1,600+", color: "bg-red-600" },
    { name: "Smart Toys", icon: Trophy, count: "900+", color: "bg-pink-400" },
    { name: "Poultry/Fish Equipment", icon: Wheat, count: "650+", color: "bg-green-700" },
    { name: "Fashion & Clothing", icon: Shirt, count: "4,800+", color: "bg-rose-500" },
    { name: "Car Accessories", icon: Wrench, count: "2,200+", color: "bg-gray-500" },
    { name: "Others", icon: Gift, count: "5,100+", color: "bg-violet-500" }
  ];

  const handleCategoryClick = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      // Navigate to category page or products
      // This can be implemented later when you have product pages
    }
  };

  const handleCustomerLogin = () => {
    navigate('/auth/customer');
    setShowLoginModal(false);
  };

  const handleVendorLogin = () => {
    navigate('/auth/vendor');
    setShowLoginModal(false);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground">
            Explore thousands of products across all categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Card 
              key={index}
              className="group cursor-pointer transition-smooth hover:shadow-marketplace hover:-translate-y-1"
              onClick={handleCategoryClick}
            >
              <CardContent className="p-6 text-center">
                <div className={`inline-flex p-4 rounded-full ${category.color} mb-4 group-hover:scale-110 transition-smooth`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-smooth">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {category.count} products
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Can't find what you're looking for? 
            <span className="text-primary font-medium cursor-pointer hover:underline ml-1">
              Browse all categories
            </span>
          </p>
        </div>
      </div>

      {/* Login Required Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center mb-2">
              🚪 Login Required
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Welcome to Swtxh Side Innovation marketplace. Please log in or sign up to explore our exclusive vendor shops and latest products.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button 
              onClick={handleCustomerLogin}
              variant="default" 
              size="lg"
              className="w-full"
            >
              Customer Login / Sign Up
            </Button>
            <Button 
              onClick={handleVendorLogin}
              variant="outline" 
              size="lg"
              className="w-full"
            >
              Vendor Login / Sign Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}