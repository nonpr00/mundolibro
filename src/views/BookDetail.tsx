import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext.tsx"
import { useCart } from "../context/CartContext.tsx"
import { bookService } from "../services/bookService"
import type { Book } from "../types"

const BookDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { addToCart, getCartItem } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)

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
        cartPath: "/novabooks/cart",
        loginPath: "/novabooks/login",
        tenant_id: "NovaBooks"
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
        cartPath: "/techshelf/cart",
        loginPath: "/techshelf/login",
        tenant_id: "TechShelf"
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
        cartPath: "/kidverse/cart",
        loginPath: "/kidverse/login",
        tenant_id: "KidVerse"
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
      loginPath: "/login",
      tenant_id: "NovaBooks" // Default tenant
    }
  }

  const config = getLibraryConfig()

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      try {
        const bookData = await bookService.getBookById(config.tenant_id, id)
        console.log("bookData", bookData)
        setBook(bookData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching book details:", error)
        setLoading(false)
        setError("Failed to load book details. Please try again later.")
      }
    }

    fetchData()
  }, [id, config.tenant_id])

  const handleAddToCart = () => {
    if (!user) {
      navigate(config.loginPath || "/")
      //navigate("/login")
      return
    }

    if (!book) return

    addToCart(book, quantity)
    setSuccess(`¡"${book.titulo}" agregado al carrito!`)
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleViewCart = () => {
    if (!user) {
      navigate(config.loginPath || "/")
      //navigate("/login")
      return
    }
    navigate(config.cartPath || "/")
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

  const cartItem = getCartItem(book.libro_id)
  const availableStock = book.stock - (cartItem?.cantidad || 0)
  const maxQuantity = Math.min(availableStock, book.stock)

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
                  {book.tenant_id}
                </span>
                <span
                  className={`inline-block text-sm px-3 py-1 rounded ${
                    availableStock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {availableStock > 0 ? `Stock: ${availableStock}` : "Sin stock"}
                </span>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Descripción</h2>
                <p className="text-gray-700 leading-relaxed">{book.descripcion}</p>
              </div>

              {cartItem ? (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-800 font-medium">✓ En el carrito</p>
                      <p className="text-sm text-green-600">Cantidad: {cartItem.cantidad}</p>
                    </div>
                    <button
                      onClick={handleViewCart}
                      className={`${config.buttonColor} text-white px-4 py-2 rounded-lg text-sm font-medium`}
                    >
                      Ver Carrito
                    </button>
                  </div>
                </div>
              ) : (
                availableStock > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                        Cantidad:
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        
                        <button
                          onClick={() => setQuantity(Math.min(quantity + 1, maxQuantity))}
                          disabled={quantity >= maxQuantity}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={handleAddToCart}
                        className={`flex-1 ${config.buttonColor} text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg`}
                      >
                        Agregar al Carrito
                      </button>
                      
                      <button
                        onClick={handleViewCart}
                        className="flex-1 py-3 px-6 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                      >
                        Ver Carrito
                      </button>
                    </div>
                  </div>
                )
              )}

              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600 mb-2">
                  ${book.precio.toFixed(2)}
                </p>
                {quantity > 1 && (
                  <p className="text-sm text-gray-600">
                    Total: ${(book.precio * quantity).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail
