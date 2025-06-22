
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicesOverview from "@/components/ServicesOverview";
import About from "@/components/About";
import Team from "@/components/Team";
import Stats from "@/components/Stats";
import DetailedServices from "@/components/DetailedServices";
import Testimonials from "@/components/Testimonials";
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ServicesOverview />
      <About />
      <Team />
      <Stats />
      <DetailedServices />
      <Testimonials />
      <Portfolio />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
