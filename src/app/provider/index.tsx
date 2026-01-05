import type { FC, ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      {/* Add more providers here if needed */}
      {/* <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> */}
      {children}
      {/* </GoogleOAuthProvider> */}
    </BrowserRouter>
  );
};

export default AppProviders;
