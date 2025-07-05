import type { User, UserWithPassword, RegisterUserData } from "../types"

// Mock service for user-related operations
// In a real application, this would make API calls to the User microservice

const MOCK_USERS: UserWithPassword[] = [
  {
    id_usuario: 1,
    nombre: "John Doe",
    email: "john@example.com",
    password: "password123",
    fecha_registro: "2023-01-15T10:30:00Z",
  },
  {
    id_usuario: 2,
    nombre: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    fecha_registro: "2023-02-20T14:45:00Z",
  },
]

// Simulate local storage for user data
const users: UserWithPassword[] = [...MOCK_USERS]

export const userService = {
  // Login user
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      throw new Error("Invalid credentials")
    }

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  // Register new user
  register: async (userData: RegisterUserData): Promise<User> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if email already exists
    if (users.some((u) => u.email === userData.email)) {
      throw new Error("Email already in use")
    }

    const newUser: UserWithPassword = {
      id_usuario: users.length + 1,
      nombre: userData.nombre,
      email: userData.email,
      password: userData.password,
      fecha_registro: new Date().toISOString(),
    }

    users.push(newUser)

    // Don't return the password
    const { password: _, ...userWithoutPassword } = newUser
    return userWithoutPassword
  },

  // Get user by ID
  getUserById: async (userId: number): Promise<User> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = users.find((u) => u.id_usuario === userId)

    if (!user) {
      throw new Error("User not found")
    }

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  // Update user profile
  updateUser: async (userId: number, userData: Partial<User>): Promise<User> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const userIndex = users.findIndex((u) => u.id_usuario === userId)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...userData,
      // Don't allow updating ID or registration date
      id_usuario: users[userIndex].id_usuario,
      fecha_registro: users[userIndex].fecha_registro,
    }

    // Don't return the password
    const { password: _, ...userWithoutPassword } = users[userIndex]
    return userWithoutPassword
  },
}
