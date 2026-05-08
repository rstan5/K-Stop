import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-background/70 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
            <span className="text-xl font-extrabold text-background">K-Stop</span>
            <span className="text-xs font-korean text-background/40 ml-1">원스톱</span>
            <p className="text-sm mt-3 leading-relaxed">Your one stop shop for K-pop! AI-verified fair prices and trusted trades.</p>
        </div>
        <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 K-Stop. All rights reserved.</p>
          <p>No monthly fees · AI-verified prices · Free to get started</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
