
import { Zap, Thermometer, SolarPanel } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ServicesOverview = () => {
  const inspectionAreas = [
    {
      icon: <Zap size={48} />,
      title: "Electrical Inspection",
      description: "Comprehensive electrical system inspections with automated reporting and compliance tracking."
    },
    {
      icon: <Thermometer size={48} />,
      title: "Refrigeration Systems",
      description: "Complete HVAC and refrigeration system inspection tools with temperature monitoring."
    },
    {
      icon: <SolarPanel size={48} />,
      title: "Solar Panel Assessment",
      description: "Solar installation inspections with performance analysis and maintenance recommendations."
    }
  ];

  return (
    <section className="py-20 bg-[#f9f9f9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a39] mb-4">Primary Inspection Areas</h2>
          <p className="text-[#7c7c7c] max-w-2xl mx-auto">
            Our SaaS platform covers all major inspection areas that technicians and engineers need for comprehensive project management.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {inspectionAreas.map((area, index) => (
            <Card key={index} className="bg-[#f26522] text-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4 text-white">
                  {area.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{area.title}</h3>
                <p className="text-white/90">{area.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
