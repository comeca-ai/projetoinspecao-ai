
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Hero = () => {
  const carouselImages = [
    {
      src: "/lovable-uploads/b0e15d53-b445-47f7-b29d-6a0357d40224.png",
      alt: "Técnico usando tablet para diagnóstico de sistema elétrico em painel industrial"
    },
    {
      src: "/lovable-uploads/07fde259-867f-47d3-ac65-96c0f4170cbf.png",
      alt: "Técnico usando câmera térmica para inspeção de equipamentos industriais"
    },
    {
      src: "/lovable-uploads/80df8c40-4c15-4b67-9f45-f58ab052b06d.png",
      alt: "Técnico com capacete de segurança fazendo anotações em tablet durante inspeção"
    },
    {
      src: "/lovable-uploads/5d728456-340e-454a-b3d2-2366ded4551c.png",
      alt: "Técnico inspecionando painéis solares com drone para monitoramento"
    }
  ];

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
              <Button variant="outline" className="border-white text-[#1e2a39] bg-white hover:bg-gray-100 hover:text-[#1e2a39] px-8 py-3 text-lg rounded-md">
                Ver Demonstração
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Carousel className="w-full max-w-lg mx-auto">
              <CarouselContent>
                {carouselImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="rounded-lg overflow-hidden shadow-2xl">
                      <img 
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-96 object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="text-[#1e2a39] bg-white border-gray-300 hover:bg-[#f26522] hover:border-[#f26522] hover:text-white" />
              <CarouselNext className="text-[#1e2a39] bg-white border-gray-300 hover:bg-[#f26522] hover:border-[#f26522] hover:text-white" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
