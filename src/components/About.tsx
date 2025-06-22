
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const features = [
    "Multi-Area Inspection Support",
    "Automated Report Generation", 
    "Real-time Collaboration",
    "Cloud-based Data Storage",
    "Mobile & Desktop Access",
    "Compliance Tracking",
    "Custom Checklists",
    "Analytics Dashboard"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Professional using inspection software on tablet"
              className="rounded-lg shadow-lg w-full h-96 object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a39]">
              Complete Inspection Management Platform for Modern Technicians
            </h2>
            <p className="text-[#7c7c7c] leading-relaxed">
              Our SaaS platform revolutionizes how technicians and engineers conduct inspections 
              across multiple areas including Electrical, Refrigeration, Solar Panels, Motors, 
              Safety, Structure, and Home Automation systems. Streamline your workflow with 
              our comprehensive digital solution.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle size={20} className="text-[#f26522]" />
                  <span className="text-[#7c7c7c]">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button className="bg-[#f26522] hover:bg-[#e55a1f] text-white px-8 py-3 text-lg rounded-md">
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
