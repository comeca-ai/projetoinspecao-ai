
import { Wrench, Settings, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ServicesOverview = () => {
  const services = [
    {
      icon: <Wrench size={48} />,
      title: "Maintenance",
      description: "Regular electrical maintenance to keep your systems running safely and efficiently."
    },
    {
      icon: <Settings size={48} />,
      title: "Repair",
      description: "Quick and reliable electrical repair services for residential and commercial properties."
    },
    {
      icon: <Zap size={48} />,
      title: "Installation",
      description: "Professional electrical installation services for new construction and upgrades."
    }
  ];

  return (
    <section className="py-20 bg-[#f9f9f9]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-[#f26522] text-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4 text-white">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-white/90">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
