import ProductCard from "./ProductCard";
import { mockProducts } from "@/data/mockProducts";

const FeaturedListings = () => {
  return (
    <section className="bg-surface-cream py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Trending Now</h2>
            <p className="text-muted-foreground">AI-verified listings updated in real time</p>
          </div>
          <button className="text-sm font-semibold text-primary hover:underline hidden md:block">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
