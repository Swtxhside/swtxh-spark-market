import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, User, Search, Menu, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block marketplace-gradient-text text-lg">
              Swtxh Side Innovation
            </span>
          </a>
        </div>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="mr-2 md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Mobile logo */}
        <div className="flex md:hidden">
          <Store className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold marketplace-gradient-text">Swtxh</span>
        </div>

        {/* Search bar */}
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-lg relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, vendors..."
              className="w-full pl-10 shadow-marketplace"
            />
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            Become a Vendor
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-secondary text-secondary-foreground"
            >
              3
            </Badge>
          </Button>

          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>

          <Button variant="hero" size="sm" className="hidden md:inline-flex">
            Sign In
          </Button>
        </nav>
      </div>

      {/* Mobile search bar */}
      <div className="border-t p-4 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, vendors..."
            className="w-full pl-10"
          />
        </div>
      </div>
    </header>
  );
}