import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedListings from "@/components/FeaturedListings";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import AiChatPanel from "@/components/AiChatPanel";

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onOpenChat={() => setChatOpen(true)} />
      <HeroSection />
      <CategoryGrid />
      <FeaturedListings />
      <HowItWorks />
      <Footer />
      <AiChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Index;
