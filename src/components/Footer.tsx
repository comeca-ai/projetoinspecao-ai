
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
              The complete SaaS platform for modern inspection management across all technical areas.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[#f26522]">Features</a></li>
              <li><a href="#" className="hover:text-[#f26522]">Pricing</a></li>
              <li><a href="#" className="hover:text-[#f26522]">Support</a></li>
              <li><a href="#" className="hover:text-[#f26522]">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@inspectionpro.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-600 pt-6 text-center">
          <p className="text-gray-300">
            © 2024 InspectionPro. All rights reserved. | Professional Inspection Management SaaS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
