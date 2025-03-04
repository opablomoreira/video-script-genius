
import React from "react";
import { PenLine } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center justify-center p-2 bg-primary/10 rounded-full mb-2">
            <PenLine className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Criador de Roteiros de Vídeo
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Transforme suas ideias em roteiros profissionais de vídeo em segundos usando tecnologia avançada de IA.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
