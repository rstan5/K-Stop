import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, TrendingUp, TrendingDown, Minus, Shield, Gem, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import { marketplaceProducts } from "@/data/marketplaceProducts";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const rarityColors: Record<string, string> = {
  "Common": "bg-secondary text-secondary-foreground",
  "Uncommon": "bg-mint/20 text-foreground",
  "Rare": "bg-accent/20 text-accent",
  "Very Rare": "bg-primary/20 text-primary",
  "Ultra Rare": "bg-gold/20 text-foreground",
  "Legendary": "bg-gradient-to-r from-primary to-accent text-primary-foreground",
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = marketplaceProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-xl font-bold text-foreground mb-2">Product not found</p>
          <Button onClick={() => navigate("/browse")}>Back to Browse</Button>
        </div>
      </div>
    );
  }

  const priceDiff = ((product.price - product.estimatedValue) / product.estimatedValue) * 100;
  const isGoodDeal = priceDiff < -5;
  const isOverpriced = priceDiff > 10;
  const rarity = product.rarityRating || "Common";

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto flex items-center h-16 px-4 gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="text-xl font-extrabold text-foreground">Item Details</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative aspect-square bg-secondary rounded-3xl overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <Badge className={`absolute top-4 left-4 text-sm font-semibold rounded-full px-4 py-1.5 ${
              isGoodDeal ? "bg-mint text-primary-foreground" : isOverpriced ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground"
            }`}>
              {isGoodDeal ? <><TrendingDown className="w-4 h-4 mr-1.5" />Great Deal</> : isOverpriced ? <><TrendingUp className="w-4 h-4 mr-1.5" />Above Value</> : <><Minus className="w-4 h-4 mr-1.5" />Fair Price</>}
            </Badge>
            <Badge className={`absolute bottom-4 left-4 text-sm font-bold rounded-full px-4 py-1.5 ${rarityColors[rarity] || rarityColors["Common"]}`}>
              <Gem className="w-4 h-4 mr-1.5" />
              {rarity}
            </Badge>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <p className="text-primary font-bold text-sm mb-1">{product.group}</p>
            <h1 className="text-3xl font-extrabold text-foreground mb-2">{product.name}</h1>
            <p className="text-muted-foreground mb-6">
              Listed by{" "}
              <span className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors">
                @{product.seller}
              </span>
            </p>

            {/* Price */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-6">
              <div className="flex items-end gap-4 mb-4">
                <span className="text-4xl font-extrabold text-foreground">${product.price.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground mb-1">+ $0.50 checkout fee</span>
              </div>

              {/* AI Value */}
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-accent" />
                  <span className="font-bold text-foreground text-sm">K-Stop AI Value Estimate</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-accent">${product.estimatedValue.toFixed(2)}</span>
                  <span className={`text-sm font-semibold ${isGoodDeal ? "text-green-600" : isOverpriced ? "text-destructive" : "text-muted-foreground"}`}>
                    {isGoodDeal ? `${Math.abs(priceDiff).toFixed(0)}% below estimated value ✨` : isOverpriced ? `${priceDiff.toFixed(0)}% above estimated value` : "Priced at fair market value"}
                  </span>
                </div>
              </div>

              {/* Rarity */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Gem className="w-5 h-5 text-primary" />
                  <span className="font-bold text-foreground text-sm">AI Rarity Rating</span>
                </div>
                <Badge className={`text-sm font-bold rounded-full px-3 py-1 ${rarityColors[rarity]}`}>
                  {rarity}
                </Badge>
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Condition", value: product.condition },
                { label: "Category", value: product.category },
                { label: "Group", value: product.group },
                { label: "Seller Rating", value: "⭐ 4.8/5" },
              ].map((item) => (
                <div key={item.label} className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                  <p className="font-bold text-foreground text-sm">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <Button size="lg" className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base font-bold h-14" onClick={handleBuyNow}>
                <ShoppingBag className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
              <Button size="lg" variant="outline" className="flex-1 rounded-full text-base font-bold h-14" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
