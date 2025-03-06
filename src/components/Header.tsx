
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center justify-center mb-2">
            <img 
              src="/lovable-uploads/a0bf4dfc-7386-4b32-a499-b3a4f7262070.png" 
              alt="Rôterizei Logo" 
              className="h-32 md:h-40"
            />
          </div>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Transforme suas ideias em roteiros profissionais de vídeo em segundos usando tecnologia avançada de IA.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
