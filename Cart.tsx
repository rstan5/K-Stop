import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, ShoppingBag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const CHECKOUT_FEE = 0.50;

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, clearCart, subtotal } = useCart();
  const total = items.length > 0 ? subtotal + CHECKOUT_FEE : 0;

  const handleCheckout = () => {
    toast.success("Checkout coming soon! 🎉");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto flex items-center h-16 px-4 gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="text-xl font-extrabold text-foreground">Your Cart</span>
          <span className="text-xs font-korean text-muted-foreground mt-0.5">장바구니</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-xl font-bold text-foreground mb-2">Your cart is empty</p>
            <p className="text-muted-foreground mb-6">Find something you love on the marketplace!</p>
            <Button className="rounded-full bg-primary text-primary-foreground" onClick={() => navigate("/browse")}>
              Browse Marketplace
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 bg-card border border-border rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-primary font-semibold">{item.group}</p>
                      <p className="font-bold text-foreground text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.condition} · Qty: {item.quantity}</p>
                      <p className="font-extrabold text-foreground mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.id);
                        toast.info(`Removed ${item.name}`);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 h-fit lg:sticky lg:top-24"
            >
              <h2 className="text-lg font-extrabold text-foreground mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
                  <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Checkout fee</span>
                  <span className="font-semibold text-foreground">${CHECKOUT_FEE.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-xl font-extrabold text-foreground">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-14 text-base mb-3"
                onClick={handleCheckout}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Checkout
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={() => {
                  clearCart();
                  toast.info("Cart cleared");
                }}
              >
                Clear Cart
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
