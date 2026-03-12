import FeatureSection from "./components/FeatureSection";
import PeriodicTableSection from "./components/PeriodicTableSection";
import ProductHero from "./components/ProductHero";

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-[#F0F4FA] font-sans selection:bg-blue-200">
      {/* Content sections inside container */}
      <div className="container mx-auto px-6 max-w-7xl">
        <ProductHero />
        <PeriodicTableSection />
      </div>

      {/* FeatureSection breaks out of container for full-width CTA */}
      <FeatureSection />
    </div>
  );
};

export default ProductsPage;
