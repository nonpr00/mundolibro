import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext.tsx"
import { useCart } from "../context/CartContext.tsx"
import { bookService } from "../services/bookService"
import type { Book } from "../types"

const Books = () => {
  const { user } = useAuth()
  const { addToCart, getCartItem } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Determinar en qué librería estamos basándonos en la URL
  const isNovaBooks = location.pathname.startsWith('/novabooks')
  const isTechShelf = location.pathname.startsWith('/techshelf')
  const isKidVerse = location.pathname.startsWith('/kidverse')

  // Configuración de colores y rutas para cada librería
  const getLibraryConfig = () => {
    if (isNovaBooks) {
      return {
        name: "NovaBooks",
        title: "Catálogo de Libros - NovaBooks",
        subtitle: "Explora nuestra amplia colección de libros",
        primaryColor: "blue",
        bgGradient: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-200",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        textColor: "text-blue-800",
        searchPlaceholder: "Buscar libros en NovaBooks...",
        tenant_id: "NovaBooks"
      }
    } else if (isTechShelf) {
      return {
        name: "TechShelf",
        title: "Catálogo de Libros - TechShelf",
        subtitle: "Explora nuestra colección de libros técnicos",
        primaryColor: "green",
        bgGradient: "from-green-50 to-teal-50",
        borderColor: "border-green-200",
        buttonColor: "bg-green-600 hover:bg-green-700",
        textColor: "text-green-800",
        searchPlaceholder: "Buscar libros en TechShelf...",
        tenant_id: "TechShelf"
      }
    } else if (isKidVerse) {
      return {
        name: "KidVerse Reads",
        title: "Catálogo de Libros - KidVerse Reads",
        subtitle: "Explora nuestra colección de libros infantiles",
        primaryColor: "orange",
        bgGradient: "from-orange-50 to-yellow-50",
        borderColor: "border-orange-200",
        buttonColor: "bg-orange-500 hover:bg-orange-600",
        textColor: "text-orange-800",
        searchPlaceholder: "Buscar libros en KidVerse Reads...",
        tenant_id: "KidVerse"
      }
    }

    // Default para rutas no específicas
    return {
      name: "MundoLibro.com",
      title: "Catálogo de Libros",
      subtitle: "Explora nuestra colección de libros",
      primaryColor: "gray",
      bgGradient: "from-gray-50 to-white",
      borderColor: "border-gray-200",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      textColor: "text-gray-800",
      searchPlaceholder: "Buscar libros...",
      tenant_id: "MundoLibro" // Default tenant
    }
  }

  const config = getLibraryConfig()

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        setError("")

        let fetchedBooks: Book[]

        if (searchQuery) {
          fetchedBooks = await bookService.searchBooks(config.tenant_id, searchQuery)
        } else {
          fetchedBooks = await bookService.listBooksByTenant(config.tenant_id)
        }

        setBooks(fetchedBooks)
      } catch (error) {
        console.error("Error fetching books:", error)
        setError("Failed to load books. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [searchQuery, config.tenant_id])

  const handleAddToCart = (book: Book) => {
    if (!user) {
      navigate(`/${config.tenant_id.toLocaleLowerCase()}/login`)
      return
    }

    addToCart(book)
    setSuccess(`¡"${book.titulo}" agregado al carrito!`)
    setTimeout(() => setSuccess(""), 3000)
  }


  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-${config.primaryColor}-500`}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${config.textColor}`}>
            {config.title}
          </h1>
          <p className="text-lg text-gray-600">
            {config.subtitle}
          </p>
        </div>

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

        {/* Search and Cart Button */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={config.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setSearchQuery(searchTerm)}
              className={`${config.buttonColor} text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </button>
          </div>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-${config.primaryColor}-100`}>
              <svg className={`w-10 h-10 text-${config.primaryColor}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.523-4.5-1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron libros</h3>
            <p className="text-gray-500">Intenta con otros términos de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => {
              const cartItem = getCartItem(book.libro_id)
              const isInCart = cartItem !== undefined
              const availableStock = book.stock - (cartItem?.cantidad || 0)

              return (
                <div key={`${book.tenant_id}-${book.libro_id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-3 aspect-h-4">
                    <img
                      src={book.cover || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"}
                      alt={book.titulo}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {book.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{book.autor}</p>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{book.descripcion}</p>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-emerald-600">
                        ${book.precio.toFixed(2)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${availableStock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {availableStock > 0 ? `Stock: ${availableStock}` : 'Sin stock'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => navigate(`./${book.libro_id}`)}
                        className="w-full py-2 px-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        Ver Detalles
                      </button>

                      {isInCart ? (
                        <div className="text-center">
                          <span className="text-sm text-green-600 font-medium">
                            ✓ En carrito ({cartItem.cantidad})
                          </span>
                        </div>
                      ) : (
                        availableStock > 0 && (
                          <button
                            onClick={() => handleAddToCart(book)}
                            className={`w-full py-2 px-3 text-sm font-medium text-white ${config.buttonColor} rounded-md transition-colors`}
                          >
                            Agregar al Carrito
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Books