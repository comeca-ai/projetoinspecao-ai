
import { CheckCircle } from "lucide-react";

const About = () => {
  const features = [
    "Best Electrical Repair Services",
    "Certified Engineers", 
    "24/7 Services",
    "Quality Assurance",
    "Licensed & Insured",
    "Emergency Response",
    "Competitive Pricing",
    "Customer Satisfaction"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Professional electrician working"
              className="rounded-lg shadow-lg w-full h-96 object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a39]">
              We Are Fully Dedicated for Your Electrical needs.
            </h2>
            <p className="text-[#7c7c7c] leading-relaxed">
              With over 15 years of experience in the electrical industry, we provide comprehensive 
              electrical services for residential, commercial, and industrial clients. Our certified 
              electricians are committed to delivering safe, reliable, and efficient solutions.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle size={20} className="text-[#f26522]" />
                  <span className="text-[#7c7c7c]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
