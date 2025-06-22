
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  return (
    <section className="py-20 bg-[#f9f9f9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a39] mb-4">Get In Touch</h2>
          <p className="text-[#7c7c7c] max-w-2xl mx-auto">
            Ready to start your electrical project? Contact us today for a free consultation and quote.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardContent className="p-8">
              <MapPin size={32} className="text-[#f26522] mx-auto mb-4" />
              <h3 className="font-bold text-[#1e2a39] mb-2">Office Address</h3>
              <p className="text-[#7c7c7c]">
                1234 Electric Avenue<br />
                Downtown, NY 10001<br />
                United States
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-8">
              <Phone size={32} className="text-[#f26522] mx-auto mb-4" />
              <h3 className="font-bold text-[#1e2a39] mb-2">Phone Numbers</h3>
              <p className="text-[#7c7c7c]">
                Main: +1 (555) 123-4567<br />
                Emergency: +1 (555) 999-8888<br />
                Fax: +1 (555) 123-4568
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-8">
              <Mail size={32} className="text-[#f26522] mx-auto mb-4" />
              <h3 className="font-bold text-[#1e2a39] mb-2">Email</h3>
              <p className="text-[#7c7c7c]">
                info@electricpro.com<br />
                support@electricpro.com<br />
                emergency@electricpro.com
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-[#1e2a39] mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Your Name" className="border-gray-300" />
                <Input placeholder="Your Email" type="email" className="border-gray-300" />
              </div>
              <Input placeholder="Phone Number" className="border-gray-300" />
              <Textarea 
                placeholder="Your Message" 
                rows={6} 
                className="border-gray-300"
              />
              <Button className="w-full bg-[#f26522] hover:bg-[#e55a1f] text-white py-3">
                Send Message
              </Button>
            </form>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-[#1e2a39] mb-6">Find Us</h3>
            <div className="bg-gray-300 h-80 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Interactive Map Would Go Here</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
