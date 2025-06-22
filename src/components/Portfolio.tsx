
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Portfolio = () => {
  const projects = {
    residential: [
      {
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Inspeção Residencial Moderna",
        description: "Inspeção completa de automação residencial"
      },
      {
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Sistema Elétrico Residencial",
        description: "Inspeção de instalação elétrica personalizada"
      },
      {
        image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Integração de Casa Inteligente",
        description: "Inspeção de sistemas automatizados"
      }
    ],
    commercial: [
      {
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Prédio Comercial",
        description: "Inspeção de sistemas elétricos eficientes"
      },
      {
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Espaço Comercial",
        description: "Inspeção de iluminação comercial"
      },
      {
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Instalação Médica",
        description: "Inspeção de sistemas hospitalares"
      }
    ],
    industrial: [
      {
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Planta Industrial",
        description: "Inspeção elétrica industrial pesada"
      },
      {
        image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Centro de Dados",
        description: "Infraestrutura de energia crítica"
      },
      {
        image: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        title: "Automação de Armazém",
        description: "Sistemas elétricos automatizados"
      }
    ]
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a39] mb-4">Nosso Portfólio</h2>
          <p className="text-[#7c7c7c] max-w-2xl mx-auto">
            Conheça alguns de nossos projetos recentes nos setores residencial, comercial e industrial.
          </p>
        </div>
        
        <Tabs defaultValue="residential" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-12">
            <TabsTrigger value="residential">Residencial</TabsTrigger>
            <TabsTrigger value="commercial">Comercial</TabsTrigger>
            <TabsTrigger value="industrial">Industrial</TabsTrigger>
          </TabsList>
          
          {Object.entries(projects).map(([category, projectList]) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-3 gap-8">
                {projectList.map((project, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      <img 
                        src={project.image}
                        alt={project.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center">
                          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                          <p className="text-sm">{project.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Portfolio;
