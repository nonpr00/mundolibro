import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { bookService } from "../services/bookService"
import { loanService } from "../services/loanService"
import { reviewService } from "../services/reviewService"
import { useAuth } from "../context/AuthContext.tsx"
import type { Book, Review } from "../types"

const BookDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [book, setBook] = useState<Book | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [reviewText, setReviewText] = useState<string>("")
  const [rating, setRating] = useState<number>(5)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  // Determinar en qué librería estamos basándonos en la URL
  const isNovaBooks = location.pathname.startsWith('/novabooks')
  const isTechShelf = location.pathname.startsWith('/techshelf')
  const isKidVerse = location.pathname.startsWith('/kidverse')
  
  // Configuración de colores y rutas para cada librería
  const getLibraryConfig = () => {
    if (isNovaBooks) {
      return {
        name: "NovaBooks",
        primaryColor: "blue",
        bgGradient: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-200",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        textColor: "text-blue-800",
        booksPath: "/novabooks/books",
        loginPath: "/novabooks/login"
      }
    } else if (isTechShelf) {
      return {
        name: "TechShelf",
        primaryColor: "green",
        bgGradient: "from-green-50 to-teal-50",
        borderColor: "border-green-200",
        buttonColor: "bg-green-600 hover:bg-green-700",
        textColor: "text-green-800",
        booksPath: "/techshelf/books",
        loginPath: "/techshelf/login"
      }
    } else if (isKidVerse) {
      return {
        name: "KidVerse Reads",
        primaryColor: "orange",
        bgGradient: "from-orange-50 to-yellow-50",
        borderColor: "border-orange-200",
        buttonColor: "bg-orange-500 hover:bg-orange-600",
        textColor: "text-orange-800",
        booksPath: "/kidverse/books",
        loginPath: "/kidverse/login"
      }
    }
    
    // Default para rutas no específicas
    return {
      name: "MundoLibro.com",
      primaryColor: "gray",
      bgGradient: "from-gray-50 to-white",
      borderColor: "border-gray-200",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      textColor: "text-gray-800",
      booksPath: "/books",
      loginPath: "/login"
    }
  }

  const config = getLibraryConfig()

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      try {
        const bookData = await bookService.getBookById(id)
        const reviewsData = await reviewService.getBookReviews(id)

        setBook(bookData)
        setReviews(reviewsData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching book details:", error)
        setLoading(false)
        setError("Failed to load book details. Please try again later.")
      }
    }

    fetchData()
  }, [id])

  const handleBorrow = async () => {
    if (!user || !id || !book) {
      navigate(config.loginPath)
      return
    }

    try {
      setSubmitting(true)
      await loanService.borrowBook(user.id_usuario, id)
      setBook({ ...book, estado: "prestado" })
      setSuccess("¡Libro prestado exitosamente!")
      setError("")
    } catch (error) {
      console.error("Error borrowing book:", error)
      setError("Error al prestar el libro. Por favor, inténtalo de nuevo.")
      setSuccess("")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !id) {
      navigate(config.loginPath)
      return
    }

    if (!reviewText.trim()) {
      setError("Por favor, escribe una reseña")
      return
    }

    try {
      setSubmitting(true)
      const newReview = await reviewService.addReview({
        id_book: id as unknown as number,
        id_user: user.id_usuario,
        username: user.nombre,
        content: reviewText,
        rating: rating,
        date: new Date()
      })

      setReviews([newReview, ...reviews])
      setReviewText("")
      setRating(5)
      setSuccess("¡Reseña enviada exitosamente!")
      setError("")
    } catch (error) {
      console.error("Error submitting review:", error)
      setError("Error al enviar la reseña. Por favor, inténtalo de nuevo.")
      setSuccess("")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-${config.primaryColor}-500`}></div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-8">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-${config.primaryColor}-100`}>
              <svg className={`w-12 h-12 text-${config.primaryColor}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.523-4.5-1.253" />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${config.textColor}`}>Libro no encontrado</h2>
            <p className="text-gray-600 mb-6">El libro que buscas no existe o ha sido removido.</p>
            <button 
              onClick={() => navigate(config.booksPath)} 
              className={`${config.buttonColor} text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg`}
            >
              Buscar más libros
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-6">
              <div className="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={book.cover || `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(book.titulo)}`}
                  alt={book.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold mb-2 text-gray-800">{book.titulo}</h1>
              <p className="text-xl text-gray-600 mb-4">por {book.autor}</p>

              <div className="flex items-center mb-6">
                <span className={`inline-block bg-${config.primaryColor}-100 text-${config.primaryColor}-800 text-sm px-3 py-1 rounded mr-3`}>
                  {book.genero}
                </span>
                <span
                  className={`inline-block text-sm px-3 py-1 rounded ${
                    book.estado === "disponible" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {book.estado === "disponible" ? "Disponible" : "Prestado"}
                </span>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Descripción</h2>
                <p className="text-gray-700 leading-relaxed">{book.descripcion || "No hay descripción disponible para este libro."}</p>
              </div>

              {book.estado === "disponible" ? (
                <button 
                  onClick={handleBorrow} 
                  disabled={submitting} 
                  className={`${config.buttonColor} text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg`}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    "Prestar Libro"
                  )}
                </button>
              ) : (
                <button disabled className="bg-gray-300 text-gray-600 cursor-not-allowed px-8 py-3 rounded-lg font-medium">
                  Actualmente no disponible
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className={`text-2xl font-bold mb-6 ${config.textColor}`}>Reseñas</h2>

          {user && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Escribe una reseña</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                    Calificación
                  </label>
                  <select
                    id="rating"
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all ${config.borderColor} focus:border-${config.primaryColor}-500 focus:ring-${config.primaryColor}-200`}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value="5">5 - Excelente</option>
                    <option value="4">4 - Muy Bueno</option>
                    <option value="3">3 - Bueno</option>
                    <option value="2">2 - Medio</option>
                    <option value="1">1 - Malo</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                    Tu reseña
                  </label>
                  <textarea
                    id="review"
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all min-h-[100px] ${config.borderColor} focus:border-${config.primaryColor}-500 focus:ring-${config.primaryColor}-200`}
                    placeholder="Comparte tus pensamientos sobre este libro..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className={`${config.buttonColor} text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg`} 
                  disabled={submitting}
                >
                  {submitting ? "Enviando..." : "Enviar reseña"}
                </button>
              </form>
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl shadow-lg">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-${config.primaryColor}-100`}>
                <svg className={`w-8 h-8 text-${config.primaryColor}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500">No hay reseñas aún. ¡Sé el primero en escribir una reseña sobre este libro!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{review.username}</h3>
                      <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                    <div className={`flex items-center bg-${config.primaryColor}-100 text-${config.primaryColor}-800 px-3 py-1 rounded-lg`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookDetail
