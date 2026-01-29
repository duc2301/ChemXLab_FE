import ProductHero from "./components/ProductHero";
import PeriodicTableSection from "./components/PeriodicTableSection";
import FeatureSection from "./components/FeatureSection";

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-[#F0F4FA] pt-16 font-sans selection:bg-blue-200">
      <div className="container mx-auto px-6 max-w-7xl">
        <ProductHero />
        <PeriodicTableSection />
        <FeatureSection />
      </div>
    </div>
  );
};

export default ProductsPage;
