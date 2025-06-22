
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Thermometer, Sun, Settings, Shield, Home } from "lucide-react";

const DetailedServices = () => {
  const inspectionAreas = [
    {
      icon: <Zap size={32} />,
      title: "Electrical Systems",
      description: "Complete electrical inspection tools with safety compliance tracking and automated reporting."
    },
    {
      icon: <Thermometer size={32} />,
      title: "Refrigeration & HVAC", 
      description: "Comprehensive cooling system inspections with temperature monitoring and efficiency analysis."
    },
    {
      icon: <Sun size={32} />,
      title: "Solar Panel Systems",
      description: "Solar installation assessments with performance metrics and maintenance scheduling."
    },
    {
      icon: <Settings size={32} />,
      title: "Motor & Machinery",
      description: "Industrial motor inspections with vibration analysis and predictive maintenance alerts."
    },
    {
      icon: <Shield size={32} />,
      title: "Safety & Compliance",
      description: "Workplace safety inspections ensuring full regulatory compliance and risk assessment."
    },
    {
      icon: <Home size={32} />,
      title: "Home Automation",
      description: "Smart home system inspections including IoT devices, security systems, and integration testing."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a39] mb-4">All Inspection Areas Covered</h2>
          <p className="text-[#7c7c7c] max-w-2xl mx-auto">
            Our comprehensive SaaS platform supports inspections across all major technical areas that modern technicians and engineers encounter.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {inspectionAreas.map((area, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4 text-[#f26522]">
                  {area.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1e2a39] mb-3">{area.title}</h3>
                <p className="text-[#7c7c7c]">{area.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedServices;
