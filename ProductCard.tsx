import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Heart, Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Product {
  id: string;
  name: string;
  group: string;
  category: string;
  price: number;
  estimatedValue: number;
  image: string;
  seller: string;
  condition: string;
  rarityRating?: string;
}

const rarityColors: Record<string, string> = {
  "Common": "bg-secondary text-secondary-foreground",
  "Uncommon": "bg-mint/20 text-foreground",
  "Rare": "bg-accent/20 text-accent",
  "Very Rare": "bg-primary/20 text-primary",
  "Ultra Rare": "bg-gold/20 text-foreground",
  "Legendary": "bg-gradient-to-r from-primary to-accent text-primary-foreground",
};

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const priceDiff = ((product.price - product.estimatedValue) / product.estimatedValue) * 100;
  const isGoodDeal = priceDiff < -5;
  const isOverpriced = priceDiff > 10;
  const rarity = product.rarityRating || "Common";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer"
    >
      <div className="relative aspect-square bg-secondary overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <button className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
          <Heart className="w-4 h-4" />
        </button>
        <Badge className={`absolute top-3 left-3 text-xs font-semibold rounded-full ${
          isGoodDeal ? "bg-mint text-primary-foreground" : isOverpriced ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground"
        }`}>
          {isGoodDeal ? (
            <><TrendingDown className="w-3 h-3 mr-1" />Great Deal</>
          ) : isOverpriced ? (
            <><TrendingUp className="w-3 h-3 mr-1" />Above Value</>
          ) : (
            <><Minus className="w-3 h-3 mr-1" />Fair Price</>
          )}
        </Badge>
        {/* Rarity Badge */}
        <Badge className={`absolute bottom-3 left-3 text-[10px] font-bold rounded-full ${rarityColors[rarity] || rarityColors["Common"]}`}>
          <Gem className="w-3 h-3 mr-1" />
          {rarity}
        </Badge>
      </div>

      <div className="p-4">
        <p className="text-xs text-primary font-semibold mb-1">{product.group}</p>
        <h3 className="font-bold text-foreground text-sm mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground mb-3">{product.condition} · {product.category}</p>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-extrabold text-foreground">${product.price.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              AI Value: <span className="font-semibold text-accent">${product.estimatedValue.toFixed(2)}</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">@{product.seller}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
