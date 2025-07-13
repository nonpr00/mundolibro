import { createContext, useContext, useState, useEffect } from "react"
import { userService } from "../services/userService"
import type { User, RegisterUserData, AuthContextType, LoginResponse, RegisterResponse } from "../types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Check if user is logged in on component mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string, tenant_id: string): Promise<User> => {
    try {
      const response: LoginResponse = await userService.login(username, password, tenant_id);
  
      const userData: User = {
        username: response.body.username,
        tenant_id: response.body.tenant_id,
      };
  
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", response.body.token);
  
      return userData;
    } catch (error) {
      console.error("Error during login:", error);
      throw error; // o puedes lanzar un error personalizado si prefieres
    }
  };
  

  const register = async (userData: RegisterUserData): Promise<RegisterResponse> => {
    const response: RegisterResponse = await userService.register(userData)
    // Don't set user or token after register - user needs to login
    return response
  }

  const logout = (): void => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
