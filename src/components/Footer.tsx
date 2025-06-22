
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1e2a39] text-white">
      <div className="bg-[#f26522] h-1"></div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="text-xl font-bold mb-4">InspectionPro</h3>
            <p className="text-gray-300 mb-4">
              A plataforma SaaS completa para gestão moderna de inspeções em todas as áreas técnicas.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[#f26522]">Recursos</a></li>
              <li><a href="#" className="hover:text-[#f26522]">Planos</a></li>
              <li><a href="#" className="hover:text-[#f26522]">Suporte</a></li>
              <li><a href="#" className="hover:text-[#f26522]">Política de Privacidade</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>suporte@inspectionpro.com.br</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+55 (11) 99999-9999</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-600 pt-6 text-center">
          <p className="text-gray-300">
            © 2024 InspectionPro. Todos os direitos reservados. | Plataforma SaaS de Gestão Profissional de Inspeções
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
