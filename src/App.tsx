import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InstitutionDetail from "./pages/InstitutionDetail";
import Institutions from "./pages/Institutions";
import Contribute from "./pages/Contribute";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import { UserProvider } from "./context/userContext";

const queryClient = new QueryClient();

const App = () => (
  <UserProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/institution/:id" element={<InstitutionDetail />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/contribute/:id" element={<Contribute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </UserProvider>
);

export default App;
