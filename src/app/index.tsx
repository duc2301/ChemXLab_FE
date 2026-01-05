import { AppProviders } from "./provider";
import { AppRoutes } from "./routes";

const App = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;
