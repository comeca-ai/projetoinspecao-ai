
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      title: "Engenheira Elétrica",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      text: "O InspectionPro revolucionou nosso processo de inspeção. A plataforma é intuitiva e os relatórios automatizados economizam horas de trabalho. Recomendo fortemente!"
    },
    {
      name: "João Santos",
      title: "Técnico em Refrigeração", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      text: "Excelente ferramenta para gestão de inspeções. O suporte técnico é excepcional e a funcionalidade mobile nos permite trabalhar em campo com muito mais eficiência."
    }
  ];

  return (
    <section className="py-20 bg-[#f9f9f9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a39] mb-4">O Que Nossos Clientes Dizem</h2>
          <p className="text-[#7c7c7c] max-w-2xl mx-auto">
            Não acredite apenas na nossa palavra. Veja o que nossos clientes satisfeitos têm a dizer sobre nossos serviços.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-[#7c7c7c] mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-[#1e2a39]">{testimonial.name}</h4>
                    <p className="text-[#7c7c7c] text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
