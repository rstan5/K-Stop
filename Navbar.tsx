import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle, ShoppingBag, Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.jpg";

interface NavbarProps {
  onOpenChat: () => void;
}

const navItems = [
  { label: "Browse", action: "navigate" as const, target: "/browse" },
  { label: "Sell", action: "navigate" as const, target: "/sell" },
  { label: "Categories", action: "scroll" as const, target: "categories" },
  { label: "How It Works", action: "scroll" as const, target: "how-it-works" },
  { label: "Get in Touch", action: "navigate" as const, target: "/contact" },
];

const Navbar = ({ onOpenChat }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();

  const handleNavClick = (item: typeof navItems[0], closeMobile = false) => {
    if (closeMobile) setMobileOpen(false);
    if (item.action === "navigate") {
      navigate(item.target);
    } else {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="K-Stop logo" className="w-8 h-8 rounded-full object-cover" />
          <span className="text-2xl font-extrabold tracking-tight text-foreground">K-Stop</span>
          <span className="text-xs font-korean text-muted-foreground mt-1">원스톱</span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative" onClick={onOpenChat}>
            <MessageCircle className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full animate-pulse-soft" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative" onClick={() => navigate("/cart")}>
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate(`/seller/${user.id}`)}>
                <User className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-muted-foreground">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="hidden md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item, true)}
              className="block w-full text-left px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"
            >
              {item.label}
            </button>
          ))}
          {user ? (
            <>
              <button
                onClick={() => { setMobileOpen(false); navigate(`/seller/${user.id}`); }}
                className="block w-full text-left px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"
              >
                My Profile
              </button>
              <Button className="w-full mt-2 rounded-full" variant="outline" onClick={() => { setMobileOpen(false); handleSignOut(); }}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              className="w-full mt-2 bg-primary text-primary-foreground rounded-full"
              onClick={() => { setMobileOpen(false); navigate("/auth"); }}
            >
              Sign In
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
