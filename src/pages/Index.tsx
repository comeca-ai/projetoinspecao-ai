
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicesOverview from "@/components/ServicesOverview";
import About from "@/components/About";
// import Stats from "@/components/Stats"; // Commented out for future implementation
import DetailedServices from "@/components/DetailedServices";
import PricingPlans from "@/components/PricingPlans";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ServicesOverview />
      <About />
      {/* <Stats /> */}
      <DetailedServices />
      <PricingPlans />
      <Testimonials />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
