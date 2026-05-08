import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-coral-light via-lavender-light to-mint-light">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-mint/20 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 bg-coral-light text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Price Verification
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-4">
            Your <span className="text-primary">one stop</span>
            <br />
            shop for K-Pop!
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
            Trade photocards, albums, lightsticks, plushies, and more — with AI that verifies fair prices. No monthly fees, and completely free to get started!
            <br /><br />
            Wait until Jungkook hears about this...
          </p>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/browse")} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20">
              Start Browsing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button onClick={() => navigate("/sell")} variant="outline" className="rounded-full px-8 h-12 text-base font-semibold border-border hover:bg-secondary">
              List an Item
            </Button>
          </div>

          <div className="flex items-center gap-6 mt-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-mint rounded-full" />
              2,400+ Active Listings
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gold rounded-full" />
              Fair Price Guarantee
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
