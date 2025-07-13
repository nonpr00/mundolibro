import type { User, RegisterUserData, RegisterResponse, LoginResponse } from "../types"
import { getApiUrl, API_CONFIG } from "../config/api"

export const userService = {
  // Login user - REAL API
  login: async (username: string, password: string, tenant_id: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.USUARIOS_BASE_URL, API_CONFIG.ENDPOINTS.LOGIN_USUARIO), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          tenant_id,
        } as User),
      })
      console.log("response login", response)

      const data: LoginResponse = await response.json()
      if (!response.ok || data.statusCode === 403) {
        throw new Error('Invalid credentials')
      }
      
      console.log("data login", data)
      return data
    } catch (error) {
      console.error('Login API error:', error)
      throw new Error('Invalid credentials')
    }
  },

  // Register new user - REAL API
  register: async (userData: RegisterUserData): Promise<RegisterResponse> => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.USUARIOS_BASE_URL, API_CONFIG.ENDPOINTS.CREAR_USUARIO), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      console.log("response register", response)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create user')
      }

      const data: RegisterResponse = await response.json()
      console.log("data register", data)

      return data
    } catch (error) {
      console.error('Register API error:', error)
      throw error
    }
  },

}

export const getAuthToken = (): string => {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No authorization token found")
  }
  return token
}