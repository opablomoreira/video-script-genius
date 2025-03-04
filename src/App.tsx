
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <div className="page-transition">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              {/* Rotas protegidas */}
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <div className="container mx-auto py-8 px-4">
                    <h1 className="text-2xl font-bold mb-4">Perfil do Usuário</h1>
                    <p>Esta página só é acessível para usuários logados.</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/meus-roteiros" element={
                <ProtectedRoute>
                  <div className="container mx-auto py-8 px-4">
                    <h1 className="text-2xl font-bold mb-4">Meus Roteiros</h1>
                    <p>Esta página só é acessível para usuários logados.</p>
                  </div>
                </ProtectedRoute>
              } />
              {/* Rota de fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
