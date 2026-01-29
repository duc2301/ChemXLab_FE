import { AppProviders } from "./provider";
import { AppRoutes } from "./routes";
import ScrollToTop from "../shared/components/ScrollToTop";

const App = () => {
  return (
    <AppProviders>
      <ScrollToTop />
      <AppRoutes />
    </AppProviders>
  );
};

export default App;
