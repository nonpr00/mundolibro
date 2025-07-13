import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { bookService } from "../../services/bookService"
import type { Book } from "../../types"
import { useAuth } from "../../context/AuthContext"

const Home = () => {
  const { user } = useAuth()
  const [popularBooks, setPopularBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const popular = await bookService.listBooksByTenant("KidVerse")

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center pt-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 via-yellow-500 to-pink-600 bg-clip-text text-transparent mb-6">
              KidVerse Reads
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Un mundo mágico de libros para niños. Historias que despiertan la imaginación y el amor por la lectura.
            </p>
            {user && (
            <Link
              to="/kidverse/books"
              className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-xl font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explorar Colección
            </Link>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Libros Infantiles</h3>
              <p className="text-gray-600">Colección especializada en literatura infantil y juvenil.</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Imaginación</h3>
              <p className="text-gray-600">Historias que despiertan la creatividad y la imaginación.</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.523-4.5-1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Aprendizaje</h3>
              <p className="text-gray-600">Libros educativos que fomentan el amor por la lectura.</p>
            </div>
          </div>
        </section>


        {/* Popular Books Section */}
        {user && (
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Libros más Populares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularBooks.sort((a, b) => b.stock - a.stock).slice(0, 8).map((book) => (
              <div key={book.libro_id} className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={book.cover || `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(book.titulo)}`}
                    alt={book.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {book.titulo}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm">{book.autor}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                      {`${book.stock} disponibles`}
                    </span>
                  </div>
                  
                  <Link 
                    to={`/kidverse/books/${book.libro_id}`} 
                    className="block w-full text-center py-2 px-4 rounded-lg font-medium transition-all duration-200 bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/kidverse/books" className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-300">
              Ver todos los libros
            </Link>
          </div>
        </section>
        )}
      </div>
    </div>
  )
}

export default Home 