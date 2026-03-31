import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";
import SocialProofPopup from "@/components/SocialProofPopup";
import AIChatWidget from "@/components/AIChatWidget";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import QuotePage from "@/pages/QuotePage";
import RentalPage from "@/pages/RentalPage";
import InstallationPage from "@/pages/InstallationPage";
import BrandsPage from "@/pages/BrandsPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import AdminPage from "@/pages/AdminPage";
import ProductSheetGeneratorPage from "@/pages/ProductSheetGeneratorPage";
import MyAccountPage from "@/pages/MyAccountPage";
import LegalPage from "@/pages/LegalPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tienda" element={<ShopPage />} />
                <Route path="/producto/:slug" element={<ProductDetailPage />} />
                <Route path="/cotizacion" element={<QuotePage />} />
                <Route path="/arrendamiento" element={<RentalPage />} />
                <Route path="/servicios/instalacion" element={<InstallationPage />} />
                <Route path="/marcas" element={<BrandsPage />} />
                <Route path="/nosotros" element={<AboutPage />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/mi-cuenta" element={<MyAccountPage />} />
                <Route path="/legal" element={<LegalPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/generador-fichas" element={<ProductSheetGeneratorPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <WhatsAppButton />
          <AIChatWidget />
          <SocialProofPopup />
          <CookieBanner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
