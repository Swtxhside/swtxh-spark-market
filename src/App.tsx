import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import CustomerAuth from "./pages/CustomerAuth";
import VendorAuth from "./pages/VendorAuth";
import CustomerDashboard from "./pages/CustomerDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/customer" element={<CustomerAuth />} />
              <Route path="/auth/vendor" element={<VendorAuth />} />
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/checkout" element={<Checkout />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
