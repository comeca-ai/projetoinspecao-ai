
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const features = [
    "Suporte a Múltiplas Áreas de Inspeção",
    "Geração Automatizada de Relatórios", 
    "Colaboração em Tempo Real",
    "Armazenamento de Dados na Nuvem",
    "Acesso Mobile e Desktop",
    "Rastreamento de Conformidade",
    "Checklists Personalizados",
    "Dashboard de Análises"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Profissional usando software de inspeção em tablet"
              className="rounded-lg shadow-lg w-full h-96 object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a39]">
              Plataforma Completa de Gestão de Inspeções para Técnicos Modernos
            </h2>
            <p className="text-[#7c7c7c] leading-relaxed">
              Nossa plataforma SaaS revoluciona como técnicos e engenheiros conduzem inspeções 
              em múltiplas áreas incluindo Elétrica, Refrigeração, Painéis Solares, Motores, 
              Segurança, Estrutural e sistemas de Automação Residencial. Otimize seu fluxo de trabalho com 
              nossa solução digital abrangente.
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
              Iniciar Teste Grátis
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
