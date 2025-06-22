
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const PricingPlans = () => {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for individual technicians",
      features: [
        "5 Inspection Areas",
        "Basic Report Generation",
        "Mobile App Access",
        "Cloud Storage (5GB)",
        "Email Support",
        "Standard Templates"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Ideal for small to medium teams",
      features: [
        "All Inspection Areas",
        "Advanced Reporting",
        "Team Collaboration",
        "Cloud Storage (50GB)",
        "Priority Support",
        "Custom Templates",
        "Analytics Dashboard",
        "API Access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Unlimited Storage",
        "Custom Integrations",
        "Dedicated Account Manager",
        "24/7 Phone Support",
        "Advanced Analytics",
        "White-label Options",
        "SSO Integration"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-[#f9f9f9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e2a39] mb-4">Choose Your Plan</h2>
          <p className="text-[#7c7c7c] max-w-2xl mx-auto">
            Select the perfect plan for your inspection needs. All plans include a 14-day free trial.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative hover:shadow-lg transition-shadow ${plan.popular ? 'border-[#f26522] border-2' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#f26522] text-white px-4 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center p-8">
                <h3 className="text-2xl font-bold text-[#1e2a39] mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-[#1e2a39]">{plan.price}</span>
                  <span className="text-[#7c7c7c]">{plan.period}</span>
                </div>
                <p className="text-[#7c7c7c]">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check size={20} className="text-[#f26522]" />
                      <span className="text-[#7c7c7c]">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-3 rounded-md ${
                    plan.popular 
                      ? 'bg-[#f26522] hover:bg-[#e55a1f] text-white' 
                      : 'bg-white border-2 border-[#f26522] text-[#f26522] hover:bg-[#f26522] hover:text-white'
                  }`}
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-[#7c7c7c] mb-4">Need a custom solution for your organization?</p>
          <Button variant="outline" className="border-[#f26522] text-[#f26522] hover:bg-[#f26522] hover:text-white">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
