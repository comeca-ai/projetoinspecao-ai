
import { MessageCircle } from "lucide-react";

const WhatsAppFloat = () => {
  const handleWhatsAppClick = () => {
    // Por enquanto usando um link placeholder - será configurado posteriormente
    const whatsappUrl = "https://web.whatsapp.com/";
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20c259] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={24} className="group-hover:animate-pulse" />
      
      {/* Tooltip opcional */}
      <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Fale conosco no WhatsApp
      </span>
    </button>
  );
};

export default WhatsAppFloat;
