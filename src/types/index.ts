// User types
export interface User {
  id_usuario: number
  nombre: string
  email: string
  fecha_registro: string
}

export interface UserWithPassword extends User {
  password: string
}

export interface RegisterUserData {
  nombre: string
  email: string
  password: string
}

// Book types
export interface Book {
  id_libro: number
  titulo: string
  autor: string
  genero: string
  estado: "disponible" | "prestado"
  descripcion?: string
  cover?: string
}

// Loan types
export interface Loan {
  id_prestamo: number
  id_usuario: number
  id_libro: number
  titulo_libro: string
  autor_libro: string
  fecha_prestamo: string
  fecha_vencimiento: string
  fecha_devolucion: string | null
  cover?: string
}

// Review types
export interface Review {
  id?: string
  id_book: number
  id_user: number
  username: string
  content: string
  rating: number
  date: Date
}

/*
export interface Review {
  id: string
  id_libro: number
  id_usuario: number
  nombre_usuario: string
  texto: string
  calificacion: number
  fecha: string
}
*/

/*
export interface NewReviewData {
  id_libro: number | string
  id_usuario: number
  nombre_usuario: string
  texto: string
  calificacion: number
  fecha?: string
}
*/

// Auth context types
export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (userData: RegisterUserData) => Promise<User>
  logout: () => void
}
