import { Route, Routes } from "react-router-dom";
import AdminLayout from "../../Widget/components/AdminLayout";
import Layout from "../../Widget/components/Layout";
import AboutPage from "../../pages/About";
import AdminChemicalsPage from "../../pages/Admin/Chemical";
import AdminDashboard from "../../pages/Admin/Dashboard";
import AdminElements from "../../pages/Admin/Elements";
import AdminPackages from "../../pages/Admin/Packages";
import AdminUsers from "../../pages/Admin/Users";
import ForgotPasswordPage from "../../pages/Auth/ForgotPassword";
import LoginPage from "../../pages/Auth/Login";
import RegisterPage from "../../pages/Auth/Register";
import BlogPage from "../../pages/Blog";
import ChatbotPage from "../../pages/Chatbot";
import ExperiencePage from "../../pages/Experience";
import HomePage from "../../pages/Home";
import LabTest from "../../pages/Lab/Temp";
import CopyrightPage from "../../pages/Legal/Copyright";
import PrivacyPage from "../../pages/Legal/Privacy";
import TermsPage from "../../pages/Legal/Terms";
import LibraryPage from "../../pages/Library";
import GradeDetail from "../../pages/Library/GradeDetail";
import PaymentPage from "../../pages/Payment";
import PaymentFailedPage from "../../pages/Payment/Failed";
import PaymentSuccessPage from "../../pages/Payment/Success";
import PeriodicTablePage from "../../pages/PeriodicTable";
import ProductsPage from "../../pages/Products";
import ProfilePage from "../../pages/Profile";
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
        <Route path="pricing" element={<ExperiencePage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="library/:gradeId" element={<GradeDetail />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="copyright" element={<CopyrightPage />} />
      </Route>
      <Route path="lab" element={<LabTest />} />
      <Route path="periodic-table" element={<PeriodicTablePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="payment" element={<PaymentPage />} />
      <Route path="chatbot" element={<ChatbotPage />} />
      <Route path="payment/success" element={<PaymentSuccessPage />} />
      <Route path="payment/failed" element={<PaymentFailedPage />} />
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="elements" element={<AdminElements />} />
        <Route path="chemicals" element={<AdminChemicalsPage />} />
      </Route>
    </Routes>
  );
};