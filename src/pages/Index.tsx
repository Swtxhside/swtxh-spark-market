import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProductCategories } from "@/components/ProductCategories";
import { FeaturedVendors } from "@/components/FeaturedVendors";
import { SubscriptionTiers } from "@/components/SubscriptionTiers";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProductCategories />
        <FeaturedVendors />
        <SubscriptionTiers />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
