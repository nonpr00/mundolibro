import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { bookService } from "../../services/bookService"
import type { Book } from "../../types"

const Home = () => {
  const [recentBooks, setRecentBooks] = useState<Book[]>([])
  const [popularBooks, setPopularBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recent = await bookService.getRecentBooks()
        const popular = await bookService.getPopularBooks()

        setRecentBooks(recent)
        setPopularBooks(popular)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              TechShelf
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              La biblioteca digital del futuro. Tecnología avanzada para una experiencia de lectura revolucionaria.
            </p>
            <Link
              to="/techshelf/books"
              className="inline-block bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explorar Colección
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tecnología Avanzada</h3>
              <p className="text-gray-600">Interfaz de última generación con funcionalidades innovadoras.</p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Acceso Rápido</h3>
              <p className="text-gray-600">Navegación ultrarrápida y búsqueda inteligente de contenido.</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.523-4.5-1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Contenido Digital</h3>
              <p className="text-gray-600">Libros digitales con características multimedia avanzadas.</p>
            </div>
          </div>
        </section>

        {/* Recent Books Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Libros Recién Añadidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentBooks.slice(0, 8).map((book) => (
              <div key={book.id_libro} className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={book.cover || `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(book.titulo)}`}
                    alt={book.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {book.estado === "disponible" ? "Disponible" : "Prestado"}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {book.titulo}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm">{book.autor}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block text-xs px-3 py-1 rounded-full bg-green-100 text-green-800">
                      {book.genero}
                    </span>
                  </div>
                  
                  <Link 
                    to={`/techshelf/books/${book.id_libro}`} 
                    className="block w-full text-center py-2 px-4 rounded-lg font-medium transition-all duration-200 bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/techshelf/books" className="inline-block bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-xl font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-300">
              Ver todos los libros
            </Link>
          </div>
        </section>

        {/* Popular Books Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Libros más Populares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularBooks.slice(0, 8).map((book) => (
              <div key={book.id_libro} className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={book.cover || `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(book.titulo)}`}
                    alt={book.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {book.estado === "disponible" ? "Disponible" : "Prestado"}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {book.titulo}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm">{book.autor}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block text-xs px-3 py-1 rounded-full bg-green-100 text-green-800">
                      {book.genero}
                    </span>
                  </div>
                  
                  <Link 
                    to={`/techshelf/books/${book.id_libro}`} 
                    className="block w-full text-center py-2 px-4 rounded-lg font-medium transition-all duration-200 bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/techshelf/books" className="inline-block bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-xl font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-300">
              Ver todos los libros
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home 