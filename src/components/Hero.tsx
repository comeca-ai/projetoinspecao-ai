
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
              Plataforma SaaS 
              <span className="text-[#f26522]"> Completa</span> de Gestão de 
              <span className="text-[#f26522]"> Inspeções</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Otimize seus processos de inspeção em múltiplas áreas incluindo Elétrica, 
              Refrigeração, Painéis Solares, Motores, Segurança, Estrutural e Automação Residencial. 
              Nossa plataforma ajuda técnicos e engenheiros a trabalhar com mais eficiência e precisão.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#f26522] hover:bg-[#e55a1f] text-white px-8 py-3 text-lg rounded-md">
                Começar a Usar Agora
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#1e2a39] px-8 py-3 text-lg rounded-md">
                Ver Demonstração
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Técnico profissional usando ferramentas de inspeção"
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
