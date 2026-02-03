import { Route, Routes } from "react-router-dom";
import Layout from "../../Widget/components/Layout";
import AboutPage from "../../pages/About";
import LoginPage from "../../pages/Auth/Login";
import RegisterPage from "../../pages/Auth/Register";
import BlogPage from "../../pages/Blog";
import ExperiencePage from "../../pages/Experience";
import HomePage from "../../pages/Home";
import LabPage from "../../pages/Lab";
import LabTest from "../../pages/Lab/Temp";
import LibraryPage from "../../pages/Library";
import GradeDetail from "../../pages/Library/GradeDetail";
import PeriodicTablePage from "../../pages/PeriodicTable";
import ProductsPage from "../../pages/Products";
import SupportPage from "../../pages/Support";

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
        <Route path="library" element={<LibraryPage />} />
        <Route path="library/:gradeId" element={<GradeDetail />} />
      </Route>
      <Route path="lab" element={<LabPage />} />
      <Route path="labtest" element={<LabTest />} />
      <Route path="periodic-table" element={<PeriodicTablePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={< RegisterPage />} />
    </Routes>
  );
};
