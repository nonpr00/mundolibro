import type { Book, UpdateBookData } from "../types"
import { API_CONFIG } from "../config/api"
import { getAuthToken } from "./userService"

// Get authorization token from localStorage
export const bookService = {
  // List books by tenant - REAL API
  listBooksByTenant: async (tenant_id: string): Promise<Book[]> => {
    try {
      const token = getAuthToken()
      const response = await fetch(`${API_CONFIG.PRODUCTOS_BASE_URL}${API_CONFIG.ENDPOINTS.LISTAR_PRODUCTOS}?tenant_id=${tenant_id}`, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("API: List books response", data)

      // Parse the body string to get the actual data
      const bodyData = JSON.parse(data.body)
      return bodyData.productos || []
    } catch (error) {
      console.error("Error fetching books:", error)
      throw error
    }
  },

  // Get book by ID and tenant - REAL API
  getBookById: async (tenant_id: string, libro_id: string): Promise<Book> => {
    try {
      const token = getAuthToken()
      
      const response = await fetch(`${API_CONFIG.PRODUCTOS_BASE_URL}${API_CONFIG.ENDPOINTS.BUSCAR_PRODUCTO}?tenant_id=${tenant_id}&libro_id=${libro_id}`, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("API: Get book response", data)

      // Parse the body string to get the actual data
      const bodyData = JSON.parse(data.body)
      return bodyData
    } catch (error) {
      console.error("Error fetching book:", error)
      throw error
    }
  },

  // Update book - REAL API
  updateBook: async (updateData: UpdateBookData): Promise<Book> => {
    try {
      const token = getAuthToken()
      console.log("token upd", token)
      
      const response = await fetch(`${API_CONFIG.PRODUCTOS_BASE_URL}${API_CONFIG.ENDPOINTS.MODIFICAR_PRODUCTO}`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tenant_id: updateData.tenant_id,
          libro_id: updateData.libro_id,
          precio: updateData.precio,
          stock: updateData.stock
        })
      })
      console.log("API: Update book response", response)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("API: Update book response", data)

      // Parse the body string to get the actual data
      const bodyData = JSON.parse(data.body)
      return bodyData.producto
    } catch (error) {
      console.error("Error updating book:", error)
      throw error
    }
  },

  // Search books by title or author within tenant - REAL API
  // Since the API doesn't have a search endpoint, we'll filter the list results
  searchBooks: async (tenant_id: string, query: string): Promise<Book[]> => {
    try {
      // Get all books for the tenant
      const allBooks = await bookService.listBooksByTenant(tenant_id)
      
      // Filter by query
      const lowercaseQuery = query.toLowerCase()
      const filteredBooks = allBooks.filter(
        (book) =>
          book.titulo.toLowerCase().includes(lowercaseQuery) ||
          book.autor.toLowerCase().includes(lowercaseQuery) ||
          book.descripcion.toLowerCase().includes(lowercaseQuery)
      )

      console.log("API: Found", filteredBooks.length, "books matching query")
      return filteredBooks
    } catch (error) {
      console.error("Error searching books:", error)
      throw error
    }
  },

  // Get available books (stock > 0) - REAL API
  getAvailableBooks: async (tenant_id: string): Promise<Book[]> => {
    try {
      // Get all books for the tenant
      const allBooks = await bookService.listBooksByTenant(tenant_id)
      
      // Filter by available stock
      const availableBooks = allBooks.filter(book => book.stock > 0)
      
      console.log("API: Found", availableBooks.length, "available books")
      return availableBooks
    } catch (error) {
      console.error("Error fetching available books:", error)
      throw error
    }
  }
}
