import type { Loan } from "../types"
import { bookService } from "./bookService"

// Mock service for loan-related operations
// In a real application, this would make API calls to the Books microservice

// Mock loans data
const MOCK_LOANS: Loan[] = [
  {
    id_prestamo: 1,
    id_usuario: 1,
    id_libro: 4,
    titulo_libro: "Harry Potter and the Sorcerer's Stone",
    autor_libro: "J.K. Rowling",
    fecha_prestamo: "2023-04-10T09:30:00Z",
    fecha_vencimiento: "2023-04-24T09:30:00Z",
    fecha_devolucion: null,
  },
  {
    id_prestamo: 2,
    id_usuario: 1,
    id_libro: 8,
    titulo_libro: "Brave New World",
    autor_libro: "Aldous Huxley",
    fecha_prestamo: "2023-04-15T14:45:00Z",
    fecha_vencimiento: "2023-04-29T14:45:00Z",
    fecha_devolucion: null,
  },
  {
    id_prestamo: 3,
    id_usuario: 2,
    id_libro: 2,
    titulo_libro: "To Kill a Mockingbird",
    autor_libro: "Harper Lee",
    fecha_prestamo: "2023-03-20T11:15:00Z",
    fecha_vencimiento: "2023-04-03T11:15:00Z",
    fecha_devolucion: "2023-04-01T10:30:00Z",
  },
]

// Simulate local storage for loan data
const loans: Loan[] = [...MOCK_LOANS]

export const loanService = {
  // Get active loans for a user
  getUserActiveLoans: async (userId: number): Promise<Loan[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return loans.filter((loan) => loan.id_usuario === userId && loan.fecha_devolucion === null)
  },

  // Get loan history for a user
  getUserLoanHistory: async (userId: number): Promise<Loan[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return loans.filter((loan) => loan.id_usuario === userId)
  },

  // Borrow a book
  borrowBook: async (userId: number, bookId: string | number): Promise<Loan> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if book exists and is available
    const book = await bookService.getBookById(bookId)

    if (book.estado !== "disponible") {
      throw new Error("Book is not available for borrowing")
    }

    // Create new loan
    const newLoan: Loan = {
      id_prestamo: loans.length + 1,
      id_usuario: userId,
      id_libro: Number.parseInt(bookId.toString()),
      titulo_libro: book.titulo,
      autor_libro: book.autor,
      fecha_prestamo: new Date().toISOString(),
      fecha_vencimiento: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      fecha_devolucion: null,
    }

    loans.push(newLoan)

    // Update book status
    await bookService.updateBookStatus(bookId, "prestado")

    return newLoan
  },

  // Return a book
  returnBook: async (loanId: number, bookId: number): Promise<Loan> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find the loan
    const loanIndex = loans.findIndex((loan) => loan.id_prestamo === loanId)

    if (loanIndex === -1) {
      throw new Error("Loan not found")
    }

    if (loans[loanIndex].fecha_devolucion !== null) {
      throw new Error("Book already returned")
    }

    // Update loan with return date
    loans[loanIndex] = {
      ...loans[loanIndex],
      fecha_devolucion: new Date().toISOString(),
    }

    // Update book status
    await bookService.updateBookStatus(bookId, "disponible")

    return loans[loanIndex]
  },

  // Get all active loans
  getAllActiveLoans: async (): Promise<Loan[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    return loans.filter((loan) => loan.fecha_devolucion === null)
  },
}
