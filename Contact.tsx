import { Instagram, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import AiChatPanel from "@/components/AiChatPanel";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.97a8.35 8.35 0 0 0 4.76 1.49V7.01a4.84 4.84 0 0 1-1-.32z" />
  </svg>
);

const Contact = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onOpenChat={() => setChatOpen(true)} />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="text-center space-y-10 max-w-md">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-display">
            Follow us on social media!
          </h1>

          <div className="space-y-6">
            <a
              href="https://instagram.com/seoullykpop"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              <Instagram className="w-7 h-7" />
              <span>@seoullykpop</span>
            </a>

            <a
              href="https://tiktok.com/@seoullykpop"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              <TikTokIcon className="w-7 h-7" />
              <span>@seoullykpop</span>
            </a>
          </div>

          <div className="pt-4 border-t border-border">
            <a
              href="mailto:seoullykpopteam@gmail.com"
              className="flex items-center justify-center gap-3 text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-6 h-6" />
              <span>seoullykpopteam@gmail.com</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <AiChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Contact;
