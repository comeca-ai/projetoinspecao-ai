
import { Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#1e2a39] text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone size={14} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={14} />
              <span>info@inspectionpro.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <Facebook size={16} className="hover:text-[#f26522] cursor-pointer transition-colors" />
              <Twitter size={16} className="hover:text-[#f26522] cursor-pointer transition-colors" />
              <Linkedin size={16} className="hover:text-[#f26522] cursor-pointer transition-colors" />
              <Instagram size={16} className="hover:text-[#f26522] cursor-pointer transition-colors" />
            </div>
            <span className="text-xs cursor-pointer hover:text-[#f26522]">Login</span>
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
            <a href="#" className="text-gray-700 hover:text-[#f26522] transition-colors">Home</a>
            <a href="#" className="text-gray-700 hover:text-[#f26522] transition-colors">Features</a>
            <a href="#" className="text-gray-700 hover:text-[#f26522] transition-colors">Inspection Areas</a>
            <a href="#" className="text-gray-700 hover:text-[#f26522] transition-colors">Pricing</a>
            <a href="#" className="text-gray-700 hover:text-[#f26522] transition-colors">Testimonials</a>
            <a href="#" className="text-gray-700 hover:text-[#f26522] transition-colors">Portfolio</a>
            <a href="#" className="text-gray-700 hover:text-[#f26522] transition-colors">Support</a>
          </nav>

          <Button className="bg-[#f26522] hover:bg-[#e55a1f] text-white px-6 py-2 rounded-md">
            Register Now
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
