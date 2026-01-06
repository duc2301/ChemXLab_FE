import { Route, Routes } from "react-router-dom";
import Layout from "../../Widget/components/Layout";
import AboutPage from "../../pages/About";
import BlogPage from "../../pages/Blog";
import ExperiencePage from "../../pages/Experience";
import HomePage from "../../pages/Home";
import ProductsPage from "../../pages/Products";
import SupportPage from "../../pages/Support";
import LabPage from "../../pages/Lab";
import LabTest from "../../pages/Lab/Temp";
import LoginPage from "../../pages/Auth/Login";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="experience" element={<ExperiencePage />} />        
      </Route>
      <Route path="lab" element={<LabPage/>} />
      <Route path="labtest" element={<LabTest />} />
      <Route path="login" element={<LoginPage />} />
    </Routes>
  );
};
