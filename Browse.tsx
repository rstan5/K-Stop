import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { marketplaceProducts } from "@/data/marketplaceProducts";

const categories = ["All", "Photocards", "Albums", "Lightsticks", "Plushies", "Posters", "Figurines"];

const Browse = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = marketplaceProducts.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.group.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto flex items-center h-16 px-4 gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="text-xl font-extrabold text-foreground">Marketplace</span>
          <span className="text-xs text-muted-foreground font-medium mt-0.5">원스톱</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by item, group, or artist..."
              className="pl-10 rounded-full border-border bg-card h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-full gap-2 h-11 px-5">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </motion.div>

        {/* Category Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {filtered.length} listing{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg font-semibold text-foreground mb-2">No listings found</p>
            <p className="text-muted-foreground">Try a different search or category</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Browse;
