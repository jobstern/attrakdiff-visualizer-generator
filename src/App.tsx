import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AttrakDiffSurvey from "./pages/AttrakDiffSurvey";
import AuthPage from "./pages/Auth";
import AdminPools from "./pages/AdminPools";
import UserPools from "./pages/UserPools";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminPoolNew from "./pages/AdminPoolNew";
import PoolSurvey from "./pages/PoolSurvey";
import PoolResults from "./pages/PoolResults";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin/pools" element={<AdminPools />} />
          <Route path="/admin/pools/new" element={<AdminPoolNew />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/user/pools" element={<UserPools />} />
          <Route path="/pools/:poolId" element={<PoolSurvey />} />
          <Route path="/pools/:poolId/results" element={<PoolResults />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
