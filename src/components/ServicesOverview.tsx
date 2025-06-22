
import { Zap, Thermometer, Sun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ServicesOverview = () => {
  const inspectionAreas = [
    {
      icon: <Zap size={48} />,
      title: "Inspeção Elétrica",
      description: "Inspeções abrangentes de sistemas elétricos com relatórios automatizados e rastreamento de conformidade."
    },
    {
      icon: <Thermometer size={48} />,
      title: "Sistemas de Refrigeração",
      description: "Ferramentas completas de inspeção HVAC e refrigeração com monitoramento de temperatura."
    },
    {
      icon: <Sun size={48} />,
      title: "Avaliação de Painéis Solares",
      description: "Inspeções de instalações solares com análise de desempenho e recomendações de manutenção."
    }
  ];

  return (
    <section className="py-20 bg-[#f9f9f9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a39] mb-4">Principais Áreas de Inspeção</h2>
          <p className="text-[#7c7c7c] max-w-2xl mx-auto">
            Nossa plataforma SaaS cobre todas as principais áreas de inspeção que técnicos e engenheiros precisam para gestão abrangente de projetos.
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
