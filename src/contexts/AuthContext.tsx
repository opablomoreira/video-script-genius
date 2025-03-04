
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se há um usuário logado ao carregar a página
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulação de autenticação - em um ambiente real, isso seria uma chamada de API
      return new Promise((resolve) => {
        setTimeout(() => {
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          const foundUser = users.find((u: any) => u.email === email && u.password === password);
          
          if (foundUser) {
            // Remove senha antes de armazenar no estado
            const { password, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
            toast.success("Login realizado com sucesso!");
            resolve(true);
          } else {
            toast.error("Email ou senha incorretos.");
            resolve(false);
          }
          setIsLoading(false);
        }, 1000);
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Ocorreu um erro durante o login. Tente novamente.");
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulação de login com Google - em um ambiente real, isso usaria a API do Google
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockGoogleUser: User = {
            id: `google-${Date.now()}`,
            name: "Usuário Google",
            email: "usuario@gmail.com",
            avatar: "https://ui-avatars.com/api/?name=Usuário+Google&background=random",
          };
          
          setUser(mockGoogleUser);
          localStorage.setItem("currentUser", JSON.stringify(mockGoogleUser));
          
          // Também adiciona à lista de usuários se não existir
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          if (!users.some((u: any) => u.email === mockGoogleUser.email)) {
            users.push(mockGoogleUser);
            localStorage.setItem("users", JSON.stringify(users));
          }
          
          toast.success("Login com Google realizado com sucesso!");
          resolve(true);
          setIsLoading(false);
        }, 1000);
      });
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      toast.error("Ocorreu um erro durante o login com Google. Tente novamente.");
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulação de registro - em um ambiente real, isso seria uma chamada de API
      return new Promise((resolve) => {
        setTimeout(() => {
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          
          // Verifica se o e-mail já está cadastrado
          if (users.some((u: any) => u.email === email)) {
            toast.error("Este e-mail já está cadastrado.");
            setIsLoading(false);
            resolve(false);
            return;
          }
          
          const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password, // Em um ambiente real, você deve hashear a senha
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            createdAt: new Date().toISOString(),
          };
          
          // Adiciona o novo usuário à lista
          users.push(newUser);
          localStorage.setItem("users", JSON.stringify(users));
          
          // Remove senha antes de armazenar no estado
          const { password: _, ...userWithoutPassword } = newUser;
          setUser(userWithoutPassword);
          localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
          
          toast.success("Cadastro realizado com sucesso!");
          resolve(true);
          setIsLoading(false);
        }, 1000);
      });
    } catch (error) {
      console.error("Erro ao fazer cadastro:", error);
      toast.error("Ocorreu um erro durante o cadastro. Tente novamente.");
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
