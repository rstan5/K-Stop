import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  X,
  Sparkles,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Footer from "@/components/Footer";

const categories = [
  "Photocards",
  "Albums",
  "Lightsticks",
  "Plushies",
  "Posters",
  "Figurines",
  "Clothing",
  "Accessories",
  "Other",
];

const conditions = ["New", "New w/ Tags", "Sealed", "Like New", "Mint", "Good", "Fair"];

interface AiEstimate {
  estimatedValue: number;
  confidence: "high" | "medium" | "low";
  reasoning: string;
  priceTip: string;
  rarityRating?: string;
  rarityReason?: string;
}

const Sell = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [estimating, setEstimating] = useState(false);
  const [estimate, setEstimate] = useState<AiEstimate | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (images.length + files.length > 6) {
      toast.error("Maximum 6 photos allowed");
      return;
    }
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getEstimate = async () => {
    if (!name || !category) {
      toast.error("Please enter the item name and category first");
      return;
    }
    setEstimating(true);
    setEstimate(null);
    try {
      const { data, error } = await supabase.functions.invoke("estimate-value", {
        body: { name, group, category, condition, description },
      });
      if (error) throw error;
      setEstimate(data as AiEstimate);
      if (data?.estimatedValue && !price) {
        setPrice(data.estimatedValue.toFixed(2));
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not get AI estimate. Try again.");
    } finally {
      setEstimating(false);
    }
  };

  const handleSubmit = () => {
    if (!name || !category || !price || images.length === 0) {
      toast.error("Please fill in all required fields and add at least one photo");
      return;
    }
    toast.success("Listing created! (Demo mode — no database yet)");
    navigate("/browse");
  };

  const priceDiff =
    estimate && price
      ? ((parseFloat(price) - estimate.estimatedValue) / estimate.estimatedValue) * 100
      : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto flex items-center h-16 px-4 gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="text-xl font-extrabold text-foreground">List an Item</span>
          <span className="text-xs text-muted-foreground font-medium mt-0.5">원스톱</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Photo Upload */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-foreground mb-1">Photos</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Add up to 6 photos. The first will be your cover.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-secondary"
              >
                <img src={img} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 w-6 h-6 bg-foreground/70 text-background rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Cover
                  </span>
                )}
              </div>
            ))}
            {images.length < 6 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-border bg-secondary/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-secondary transition-colors">
                <ImagePlus className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </motion.div>

        {/* Item Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 mb-8"
        >
          <h2 className="text-lg font-bold text-foreground">Item Details</h2>

          <div>
            <label className="text-sm font-semibold text-foreground mb-1 block">
              Item Name *
            </label>
            <Input
              placeholder="e.g. JIMIN 'FACE' Photocard Set"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl bg-card border-border"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-1 block">
              Group / Artist
            </label>
            <Input
              placeholder="e.g. BTS, NewJeans, BLACKPINK"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="rounded-xl bg-card border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">
                Category *
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl bg-card border-border">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">
                Condition
              </label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="rounded-xl bg-card border-border">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-1 block">
              Description
            </label>
            <Textarea
              placeholder="Describe your item — include details like version, inclusions, flaws, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl bg-card border-border min-h-[100px]"
            />
          </div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-foreground mb-1">Pricing</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Set your price or let our AI help you find the right one.
          </p>

          {/* AI Estimate Button */}
          <Button
            variant="outline"
            onClick={getEstimate}
            disabled={estimating}
            className="w-full rounded-xl h-12 mb-4 border-primary/30 text-primary hover:bg-primary/5 gap-2"
          >
            {estimating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing market value...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Get AI Price Estimate
              </>
            )}
          </Button>

          {/* AI Result Card */}
          {estimate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-lavender-light to-mint-light border border-border rounded-2xl p-5 mb-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-foreground">AI Valuation</span>
                <span
                  className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                    estimate.confidence === "high"
                      ? "bg-mint/20 text-mint"
                      : estimate.confidence === "medium"
                      ? "bg-gold/20 text-gold"
                      : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {estimate.confidence} confidence
                </span>
              </div>
              <p className="text-3xl font-extrabold text-foreground mb-2">
                ${estimate.estimatedValue.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mb-2">{estimate.reasoning}</p>
              <p className="text-xs text-primary font-semibold">💡 {estimate.priceTip}</p>
              {estimate.rarityRating && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-sm font-bold text-foreground mb-1">💎 Rarity: {estimate.rarityRating}</p>
                  {estimate.rarityReason && <p className="text-xs text-muted-foreground">{estimate.rarityReason}</p>}
                </div>
              )}
            </motion.div>
          )}

          {/* Price Input */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-1 block">
              Your Price (USD) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                $
              </span>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-8 rounded-xl bg-card border-border h-12 text-lg font-bold"
              />
            </div>
          </div>

          {/* Price comparison indicator */}
          {priceDiff !== null && estimate && (
            <div
              className={`flex items-center gap-2 mt-3 text-sm font-semibold ${
                priceDiff < -5
                  ? "text-mint"
                  : priceDiff > 10
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {priceDiff < -5 ? (
                <>
                  <TrendingDown className="w-4 h-4" /> Great deal for buyers —{" "}
                  {Math.abs(priceDiff).toFixed(0)}% below estimated value
                </>
              ) : priceDiff > 10 ? (
                <>
                  <TrendingUp className="w-4 h-4" /> {priceDiff.toFixed(0)}% above estimated
                  value — may sell slower
                </>
              ) : (
                <>
                  <Minus className="w-4 h-4" /> Fair price — close to estimated value
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleSubmit}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-14 text-base font-bold shadow-lg shadow-primary/20"
          >
            <Upload className="w-5 h-5 mr-2" />
            List Item for Trade
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Free to list · AI-verified pricing · No monthly fees
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Sell;
