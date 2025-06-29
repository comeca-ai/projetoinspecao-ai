import { Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#1e2a39] text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone size={14} />
              <span>+55 (11) 99999-9999</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={14} />
              <span>contato@inspectionpro.com.br</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <Facebook size={16} className="hover:text-[#f26522] cursor-pointer transition-colors" />
              <Twitter size={16} className="hover:text-[#f26522] cursor-pointer transition-colors" />
              <Linkedin size={16} className="hover:text-[#f26522] cursor-pointer transition-colors" />
              <Instagram size={16} className="hover:text-[#f26522] cursor-pointer transition-colors" />
            </div>
            <Link
              to="/auth/login"
              className="text-xs cursor-pointer hover:text-[#f26522] transition-colors"
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-[#1e2a39]">
            Inspection<span className="text-[#f26522]">Pro</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-[#f26522] transition-colors">Início</a>
            <a href="#" className="text-gray-700 hover:text-[#f26522] transition-colors">Recursos</a>
            <a href="#" className="text-gray-700 hover:text-[#f26522] transition-colors">Áreas de Inspeção</a>
            <a href="#" className="text-gray-700 hover:text-[#f26522] transition-colors">Planos</a>
            <a href="#" className="text-gray-700 hover:text-[#f26522] transition-colors">Depoimentos</a>
            <a href="#" className="text-gray-700 hover:text-[#f26522] transition-colors">Portfólio</a>
            <a href="#" className="text-gray-700 hover:text-[#f26522] transition-colors">Suporte</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link to="/auth/login">
              <Button 
                variant="outline" 
                className="border-[#f26522] text-[#f26522] hover:bg-[#f26522] hover:text-white px-4 py-2 rounded-md"
              >
                Login
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button className="bg-[#f26522] hover:bg-[#e55a1f] text-white px-6 py-2 rounded-md">
                Registrar Agora
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;