import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { bookService } from "../services/bookService"
import type { Book } from "../types"

const Books = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedGenre, setSelectedGenre] = useState<string>("")
  const [genres, setGenres] = useState<string[]>([])
  const location = useLocation()
  
  // Determinar en qué librería estamos basándonos en la URL
  const isNovaBooks = location.pathname.startsWith('/novabooks')
  const isTechShelf = location.pathname.startsWith('/techshelf')
  const isKidVerse = location.pathname.startsWith('/kidverse')
  
  // Configuración de colores y rutas para cada librería
  const getLibraryConfig = () => {
    if (isNovaBooks) {
      return {
        name: "NovaBooks",
        title: "Catálogo NovaBooks",
        subtitle: "Descubre la nueva era de la lectura digital con nuestra colección premium",
        primaryColor: "blue",
        bgGradient: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-200",
        focusColor: "focus:border-blue-500 focus:ring-blue-200",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        textColor: "text-blue-800",
        genreBgColor: "bg-blue-100 text-blue-800",
        bookDetailPath: "/novabooks/books"
      }
    } else if (isTechShelf) {
      return {
        name: "TechShelf",
        title: "Catálogo TechShelf",
        subtitle: "La biblioteca digital del futuro con tecnología avanzada",
        primaryColor: "green",
        bgGradient: "from-green-50 to-teal-50",
        borderColor: "border-green-200",
        focusColor: "focus:border-green-500 focus:ring-green-200",
        buttonColor: "bg-green-600 hover:bg-green-700",
        textColor: "text-green-800",
        genreBgColor: "bg-green-100 text-green-800",
        bookDetailPath: "/techshelf/books"
      }
    } else if (isKidVerse) {
      return {
        name: "KidVerse Reads",
        title: "Catálogo KidVerse Reads",
        subtitle: "Un mundo mágico de libros para niños que despiertan la imaginación",
        primaryColor: "orange",
        bgGradient: "from-orange-50 to-yellow-50",
        borderColor: "border-orange-200",
        focusColor: "focus:border-orange-500 focus:ring-orange-200",
        buttonColor: "bg-orange-500 hover:bg-orange-600",
        textColor: "text-orange-800",
        genreBgColor: "bg-orange-100 text-orange-800",
        bookDetailPath: "/kidverse/books"
      }
    }
    
    // Default para rutas no específicas
    return {
      name: "MundoLibro.com",
      title: "Catálogo de Libros",
      subtitle: "Explora nuestra extensa colección de libros digitales",
      primaryColor: "gray",
      bgGradient: "from-gray-50 to-white",
      borderColor: "border-gray-200",
      focusColor: "focus:border-gray-500 focus:ring-gray-200",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      textColor: "text-gray-800",
      genreBgColor: "bg-gray-100 text-gray-800",
      bookDetailPath: "/books"
    }
  }

  const config = getLibraryConfig()

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.getAllBooks()
        setBooks(data)
        // que la API filtre
        setFilteredBooks(data)

        // Extract unique genres
        const uniqueGenres = [...new Set(data.map((book) => book.genero))]
        setGenres(uniqueGenres)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching books:", error)
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  useEffect(() => {
    // Filter books based on search term and selected genre
    let result = books

    if (searchTerm) {
      result = result.filter(
        (book) =>
          book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.autor.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedGenre) {
      result = result.filter((book) => book.genero === selectedGenre)
    }

    setFilteredBooks(result)
  }, [searchTerm, selectedGenre, books])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-${config.primaryColor}-500`}></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${config.textColor}`}>
            {config.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {config.subtitle}
          </p>
        </div>

        {/* Filtros modernos */}
        <div className={`mb-8 p-6 rounded-2xl shadow-lg bg-white`}>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar libros
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  id="search"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all ${config.borderColor} ${config.focusColor}`}
                  placeholder="Buscar por título o autor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="lg:w-1/3">
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por género
              </label>
              <select
                id="genre"
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all ${config.borderColor} ${config.focusColor}`}
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">Todos los géneros</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-${config.primaryColor}-100`}>
              <svg className={`w-12 h-12 text-${config.primaryColor}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.523-4.5-1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron libros</h3>
            <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id_libro} className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={book.cover || `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(book.titulo)}`}
                    alt={book.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                    book.estado === "disponible" 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.estado === "disponible" ? "Disponible" : "Prestado"}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className={`font-bold text-lg mb-2 line-clamp-2 group-hover:text-${config.primaryColor}-600 transition-colors`}>
                    {book.titulo}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm">{book.autor}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-block text-xs px-3 py-1 rounded-full ${config.genreBgColor}`}>
                      {book.genero}
                    </span>
                  </div>
                  
                  <Link 
                    to={`${config.bookDetailPath}/${book.id_libro}`} 
                    className={`block w-full text-center py-2 px-4 rounded-lg font-medium transition-all duration-200 ${config.buttonColor} text-white hover:shadow-lg`}
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Books