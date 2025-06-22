
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Thermometer, Sun, Settings, Shield, Home } from "lucide-react";

const DetailedServices = () => {
  const inspectionAreas = [
    {
      icon: <Zap size={32} />,
      title: "Sistemas Elétricos",
      description: "Ferramentas completas de inspeção elétrica com rastreamento de conformidade de segurança e relatórios automatizados."
    },
    {
      icon: <Thermometer size={32} />,
      title: "Refrigeração & HVAC", 
      description: "Inspeções abrangentes de sistemas de refrigeração com monitoramento de temperatura e análise de eficiência."
    },
    {
      icon: <Sun size={32} />,
      title: "Sistemas de Painéis Solares",
      description: "Avaliações de instalações solares com métricas de desempenho e agendamento de manutenção."
    },
    {
      icon: <Settings size={32} />,
      title: "Motores & Máquinas",
      description: "Inspeções de motores industriais com análise de vibração e alertas de manutenção preditiva."
    },
    {
      icon: <Shield size={32} />,
      title: "Segurança & Conformidade",
      description: "Inspeções de segurança no trabalho garantindo total conformidade regulatória e avaliação de riscos."
    },
    {
      icon: <Home size={32} />,
      title: "Automação Residencial",
      description: "Inspeções de sistemas residenciais inteligentes incluindo dispositivos IoT, sistemas de segurança e testes de integração."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a39] mb-4">Todas as Áreas de Inspeção Cobertas</h2>
          <p className="text-[#7c7c7c] max-w-2xl mx-auto">
            Nossa plataforma SaaS abrangente suporta inspeções em todas as principais áreas técnicas que técnicos e engenheiros modernos encontram.
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
