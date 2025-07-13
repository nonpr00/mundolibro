// User types
export interface User {
  username: string
  tenant_id: string
}

export interface UserWithPassword extends User {
  password: string
}

export interface RegisterUserData {
  username: string
  password: string
  tenant_id: string
}

export interface LoginUserData {
  username: string
  password: string
  tenant_id: string
}

// API Response types
export interface RegisterResponse {
  statusCode: number
  body: {
    message: string
    tenant_id: string
    username: string
  }
}

export interface LoginResponse {
  statusCode: number
  body: {
    message: string
    token: string
    expires: string
    tenant_id: string
    username: string
  }
}

// Book types - Updated for Productos API structure
export interface Book {
  tenant_id: string
  libro_id: string
  titulo: string
  autor: string
  precio: number
  stock: number
  descripcion: string
  cover?: string // Optional field for UI
}

// Book API Request types
export interface CreateBookData {
  tenant_id: string
  libro_id: string
  titulo: string
  autor: string
  precio: number
  stock: number
  descripcion: string
}

export interface UpdateBookData {
  tenant_id: string
  libro_id: string
  precio?: number
  stock?: number
}

export interface DeleteBookData {
  tenant_id: string
  libro_id: string
}

// Book API Response types
export interface CreateBookResponse {
  statusCode: number
  body: {
    message: string
    producto: Book
  }
}

export interface UpdateBookResponse {
  statusCode: number
  body: {
    message: string
    producto: Partial<Book>
  }
}

export interface DeleteBookResponse {
  statusCode: number
  body: {
    message: string
    producto: {
      tenant_id: string
      libro_id: string
    }
  }
}

export interface ListBooksResponse {
  statusCode: number
  body: {
    productos: Book[]
    lastKey?: string // For pagination
  }
}

export interface GetBookResponse {
  statusCode: number
  body: Book
}

// Cart types
export interface CartItem {
  libro_id: string
  titulo: string
  autor: string
  precio: number
  stock: number
  cover?: string
  cantidad: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// Purchase types
export interface PurchaseItem {
  libro_id: string
  cantidad: number
}

export interface Purchase {
  compra_id: string // Changed from number to string to match API
  tenant_id: string
  username: string
  "username#compra_id": string
  items: PurchaseItem[]
  total: number
  //fecha_compra: string
  timestamp: string
  //estado: "completada" | "pendiente" | "cancelada"
}

export interface RegisterPurchaseData {
  tenant_id: string
  username: string
  items: PurchaseItem[]
  total: number
}

export interface RegisterPurchaseResponse {
  statusCode: number
  body: {
    message: string
    compra_id: string // Changed from number to string
  }
}

export interface ListPurchasesData {
  tenant_id: string
  username: string
}

export interface ListPurchasesResponse {
  statusCode: number
  body: {
    compras: Purchase[]
  }
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

// Auth context types
export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string, tenant_id: string) => Promise<User>
  register: (userData: RegisterUserData) => Promise<RegisterResponse>
  logout: () => void
}
