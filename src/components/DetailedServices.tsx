
import { Card, CardContent } from "@/components/ui/card";
import { Home, Building, Factory, Lightbulb, Shield, Wrench } from "lucide-react";

const DetailedServices = () => {
  const services = [
    {
      icon: <Home size={32} />,
      title: "Residential",
      description: "Complete electrical services for homes including wiring, outlets, and lighting installations."
    },
    {
      icon: <Building size={32} />,
      title: "Commercial", 
      description: "Professional electrical solutions for offices, retail spaces, and commercial buildings."
    },
    {
      icon: <Factory size={32} />,
      title: "Industrial",
      description: "Heavy-duty electrical systems for manufacturing facilities and industrial complexes."
    },
    {
      icon: <Lightbulb size={32} />,
      title: "Lighting Design",
      description: "Custom lighting solutions that enhance aesthetics and improve energy efficiency."
    },
    {
      icon: <Shield size={32} />,
      title: "Safety Inspections",
      description: "Comprehensive electrical safety inspections to ensure code compliance and safety."
    },
    {
      icon: <Wrench size={32} />,
      title: "Emergency Repairs",
      description: "24/7 emergency electrical repair services to restore power quickly and safely."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a39] mb-4">Our Services</h2>
          <p className="text-[#7c7c7c] max-w-2xl mx-auto">
            We provide comprehensive electrical services for all your residential, commercial, and industrial needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4 text-[#f26522]">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1e2a39] mb-3">{service.title}</h3>
                <p className="text-[#7c7c7c]">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedServices;
