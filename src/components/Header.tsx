import { Button } from "@/components/ui/button";
import { ShoppingCart } from "@/components/ShoppingCart";
import { Input } from "@/components/ui/input";
import { Search, User, Menu, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block marketplace-gradient-text text-lg">
              Swtxh Side Innovation
            </span>
          </Link>
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
          <Link to="/products">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Products
            </Button>
          </Link>
          
          {/* Vendor Links */}
          {user && (
            <>
              <Link to="/vendor/dashboard">
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                  Vendor Portal
                </Button>
              </Link>
              <Link to="/vendor/products">
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                  Manage Products
                </Button>
              </Link>
            </>
          )}
          
          {/* Admin Link - TODO: Add role check */}
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Admin
            </Button>
          </Link>
          
          {/* Shopping Cart */}
          <ShoppingCart />

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  My Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/orders')}>
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                  Wishlist
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth/customer">
              <Button variant="hero" size="sm" className="hidden md:inline-flex">
                Sign In
              </Button>
            </Link>
          )}
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