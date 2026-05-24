import { createContext, useContext, useRef, useState } from "react";

interface User {
  id: string;
  email: string;
  nombre: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nombre: string) => Promise<void>;
  logout: () => void;
  fetchWithAuth: (path: string, options?: RequestInit) => Promise<Response>;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  fetchWithAuth: async () => new Response(),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const tokenRef = useRef<string | null>(null);

  const setTokenSafe = (newToken: string | null) => {
    tokenRef.current = newToken;
    setToken(newToken);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      const tk = data.access_token || data.session?.access_token || data.token;
      if (!tk) {
        console.warn("Login response:", JSON.stringify(data));
        throw new Error("No se recibió token de autenticación");
      }

      setUser(data.user);
      setTokenSafe(tk);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, nombre: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nombre }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrarse");

      const tk = data.access_token || data.session?.access_token || data.token;
      if (!tk) {
        console.warn("Register response:", JSON.stringify(data));
        throw new Error("No se recibió token de autenticación");
      }

      setUser(data.user);
      setTokenSafe(tk);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokenSafe(null);
  };

  const fetchWithAuth = (path: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };
    if (tokenRef.current) {
      headers["Authorization"] = `Bearer ${tokenRef.current}`;
    }
    return fetch(`${API_URL}${path}`, { ...options, headers });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
