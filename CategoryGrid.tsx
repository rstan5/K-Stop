import { motion } from "framer-motion";
import { CreditCard, Disc3, Image, Cat, Lightbulb, Figma } from "lucide-react";

const categories = [
  { name: "Photocards", icon: CreditCard, color: "bg-coral-light text-primary", count: 840 },
  { name: "Albums", icon: Disc3, color: "bg-lavender-light text-lavender", count: 520 },
  { name: "Posters", icon: Image, color: "bg-mint-light text-mint", count: 310 },
  { name: "Plushies", icon: Cat, color: "bg-gold-light text-gold", count: 195 },
  { name: "Lightsticks", icon: Lightbulb, color: "bg-coral-light text-primary", count: 280 },
  { name: "Figurines", icon: Figma, color: "bg-lavender-light text-lavender", count: 165 },
];

const CategoryGrid = () => {
  return (
    <section id="categories" className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Shop by Category</h2>
        <p className="text-muted-foreground">Find exactly what you're looking for</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group"
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${cat.color} transition-transform group-hover:scale-110`}>
              <cat.icon className="w-6 h-6" />
            </div>
            <span className="font-semibold text-sm text-foreground">{cat.name}</span>
            <span className="text-xs text-muted-foreground">{cat.count} items</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
