import { motion } from "framer-motion";
import { Upload, Brain, ShieldCheck, CreditCard } from "lucide-react";

const steps = [
  { icon: Upload, title: "List Your Item", desc: "Upload photos and details of your K-pop merch", color: "bg-coral-light text-primary" },
  { icon: Brain, title: "AI Evaluates", desc: "Our AI calculates the fair market value instantly", color: "bg-lavender-light text-lavender" },
  { icon: ShieldCheck, title: "Price Verified", desc: "Buyers see if the price is fair, great, or above value", color: "bg-mint-light text-mint" },
  { icon: CreditCard, title: "Easy Checkout", desc: "Completely free to get started — no monthly fees ever", color: "bg-gold-light text-gold" },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">How K-Stop Works</h2>
        <p className="text-muted-foreground">Fair, transparent, and AI-powered</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="text-center"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${step.color}`}>
              <step.icon className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
