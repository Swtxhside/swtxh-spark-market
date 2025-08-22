import { Card, CardContent } from "@/components/ui/card";
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Heart, 
  Car, 
  Book, 
  Gamepad2, 
  ShoppingBag,
  Baby,
  Dumbbell,
  Utensils,
  Camera
} from "lucide-react";

export function ProductCategories() {
  const categories = [
    { name: "Electronics", icon: Smartphone, count: "12,500+", color: "bg-blue-500" },
    { name: "Fashion", icon: Shirt, count: "8,200+", color: "bg-pink-500" },
    { name: "Home & Garden", icon: Home, count: "6,800+", color: "bg-green-500" },
    { name: "Health & Beauty", icon: Heart, count: "4,300+", color: "bg-red-500" },
    { name: "Automotive", icon: Car, count: "3,100+", color: "bg-orange-500" },
    { name: "Books & Education", icon: Book, count: "2,900+", color: "bg-purple-500" },
    { name: "Gaming", icon: Gamepad2, count: "2,200+", color: "bg-indigo-500" },
    { name: "Bags & Luggage", icon: ShoppingBag, count: "1,800+", color: "bg-yellow-500" },
    { name: "Baby & Kids", icon: Baby, count: "1,600+", color: "bg-cyan-500" },
    { name: "Sports & Fitness", icon: Dumbbell, count: "1,400+", color: "bg-emerald-500" },
    { name: "Food & Beverages", icon: Utensils, count: "1,200+", color: "bg-amber-500" },
    { name: "Photography", icon: Camera, count: "900+", color: "bg-slate-500" }
  ];

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
    </section>
  );
}