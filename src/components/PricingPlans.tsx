
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const PricingPlans = () => {
  const plans = [
    {
      name: "Iniciante",
      price: "R$ 89",
      period: "/mês",
      description: "Perfeito para técnicos individuais",
      features: [
        "5 Áreas de Inspeção",
        "Geração Básica de Relatórios",
        "Acesso ao App Mobile",
        "Armazenamento na Nuvem (5GB)",
        "Suporte por Email",
        "Templates Padrão"
      ],
      popular: false
    },
    {
      name: "Profissional",
      price: "R$ 239",
      period: "/mês",
      description: "Ideal para equipes pequenas e médias",
      features: [
        "Todas as Áreas de Inspeção",
        "Relatórios Avançados",
        "Colaboração em Equipe",
        "Armazenamento na Nuvem (50GB)",
        "Suporte Prioritário",
        "Templates Personalizados",
        "Dashboard de Análises",
        "Acesso à API"
      ],
      popular: true
    },
    {
      name: "Empresarial",
      price: "R$ 599",
      period: "/mês",
      description: "Para grandes organizações",
      features: [
        "Tudo do Profissional",
        "Armazenamento Ilimitado",
        "Integrações Personalizadas",
        "Gerente de Conta Dedicado",
        "Suporte 24/7 por Telefone",
        "Análises Avançadas",
        "Opções White-label",
        "Integração SSO"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-[#f9f9f9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a39] mb-4">Escolha Seu Plano</h2>
          <p className="text-[#7c7c7c] max-w-2xl mx-auto">
            Selecione o plano perfeito para suas necessidades de inspeção. Todos os planos incluem 14 dias de teste grátis.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative hover:shadow-lg transition-shadow ${plan.popular ? 'border-[#f26522] border-2' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#f26522] text-white px-4 py-2 rounded-full text-sm font-bold">
                    Mais Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center p-8">
                <h3 className="text-2xl font-bold text-[#1e2a39] mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-[#1e2a39]">{plan.price}</span>
                  <span className="text-[#7c7c7c]">{plan.period}</span>
                </div>
                <p className="text-[#7c7c7c]">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check size={20} className="text-[#f26522]" />
                      <span className="text-[#7c7c7c]">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-3 rounded-md ${
                    plan.popular 
                      ? 'bg-[#f26522] hover:bg-[#e55a1f] text-white' 
                      : 'bg-white border-2 border-[#f26522] text-[#f26522] hover:bg-[#f26522] hover:text-white'
                  }`}
                >
                  Iniciar Teste Grátis
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-[#7c7c7c] mb-4">Precisa de uma solução personalizada para sua organização?</p>
          <Button variant="outline" className="border-[#f26522] text-[#f26522] hover:bg-[#f26522] hover:text-white">
            Contatar Vendas
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
