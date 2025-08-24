import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Truck, 
  Shield, 
  ArrowLeft, 
  MapPin,
  Phone,
  Mail,
  User
} from 'lucide-react';

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/products');
    }
  }, [items, navigate]);

  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state'];
    for (const field of required) {
      if (!shippingInfo[field as keyof typeof shippingInfo]) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
        });
        return false;
      }
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;
    
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would:
      // 1. Create order in database
      // 2. Process payment via Stripe
      // 3. Send confirmation email
      // 4. Update inventory
      
      clearCart();
      
      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: "Please try again or use a different payment method.",
      });
    } finally {
      setProcessing(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50000 ? 0 : 2500; // Free shipping over ₦50,000
  const tax = subtotal * 0.075; // 7.5% VAT
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        className="pl-10"
                        value={shippingInfo.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="+234 801 234 5678"
                      className="pl-10"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      className="pl-10"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Lagos"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="Lagos State"
                      value={shippingInfo.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="100001"
                    value={shippingInfo.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Label htmlFor="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="bank"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Label htmlFor="bank">Bank Transfer</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="wallet"
                      name="payment"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Label htmlFor="wallet">Mobile Wallet (Paystack)</Label>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Shield className="h-4 w-4 text-success" />
                  <span className="text-sm">Your payment information is secured with 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          by {item.vendor_name}
                        </p>
                        <p className="text-sm">
                          Qty: {item.quantity} × ₦{item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          Free
                        </Badge>
                      ) : (
                        `₦${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (7.5%)</span>
                    <span>₦{tax.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Pay ₦${total.toLocaleString()}`}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  By placing your order, you agree to our terms and conditions
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card>
              <CardContent className="p-4">
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <span className="font-medium">Estimated Delivery</span>
                  </div>
                  <p className="text-muted-foreground ml-6">
                    3-5 business days within Nigeria
                  </p>
                  {shipping === 0 && (
                    <Badge variant="secondary" className="bg-success/10 text-success ml-6">
                      FREE shipping on orders over ₦50,000
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}