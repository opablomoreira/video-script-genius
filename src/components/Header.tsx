
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
            Video Script Creator
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Transform your ideas into professional video scripts in seconds using advanced AI technology.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
