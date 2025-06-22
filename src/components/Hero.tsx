
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-[#1e2a39] text-white py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 border-2 border-[#f26522] rounded-full opacity-20"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-[#f26522] rounded-full opacity-20"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              We Are Providing Best 
              <span className="text-[#f26522]"> Electrical</span> and 
              <span className="text-[#f26522]"> Repair</span> Services
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Our team is ready to solve your electrical problems quickly, safely, and efficiently. 
              From simple repairs to full electrical installations, we've got you covered with 
              certified engineers and 24/7 service availability.
            </p>
            <Button className="bg-[#f26522] hover:bg-[#e55a1f] text-white px-8 py-3 text-lg rounded-md">
              Contact Us
            </Button>
          </div>
          
          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Professional electrician at work"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
