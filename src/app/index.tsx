import ScrollToTop from "../shared/components/ScrollToTop";
import { AppProviders } from "./provider";
import { AppRoutes } from "./routes";

const App = () => {
  return (
    <AppProviders>
      <ScrollToTop />
      <AppRoutes />
    </AppProviders>
  );
};

export default App;
