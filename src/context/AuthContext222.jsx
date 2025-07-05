/*
import { createContext, useContext, useState, useEffect } from "react"
import { userService } from "../services/userService"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on component mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const userData = await userService.login(email, password)
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return userData
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const newUser = await userService.register(userData)
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      return newUser
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
*/