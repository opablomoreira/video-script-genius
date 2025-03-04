
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Erro 404: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="text-center px-4 animate-fade-in">
        <h1 className="text-7xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          A página que você está procurando não existe.
        </p>
        <Button asChild className="transition-all">
          <a href="/">
            <Home className="mr-2 h-4 w-4" />
            Voltar para Início
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
