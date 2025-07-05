import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { userService } from "../services/userService"
import type { User, RegisterUserData, AuthContextType } from "../types"

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
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

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const userData = await userService.login(email, password)
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return userData
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: RegisterUserData): Promise<User> => {
    try {
      const newUser = await userService.register(userData)
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      return newUser
    } catch (error) {
      throw error
    }
  }

  const logout = (): void => {
    setUser(null)
    localStorage.removeItem("user")
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
