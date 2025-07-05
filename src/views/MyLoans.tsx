import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext.tsx"
import { loanService } from "../services/loanService"
import type { Loan } from "../types"

const MyLoans = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [activeLoans, setActiveLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [returningBook, setReturningBook] = useState<number | null>(null)

  // Determinar en qué librería estamos basándonos en la URL
  const isNovaBooks = location.pathname.startsWith('/novabooks')
  const isTechShelf = location.pathname.startsWith('/techshelf')
  const isKidVerse = location.pathname.startsWith('/kidverse')
  
  // Configuración de colores y rutas para cada librería
  const getLibraryConfig = () => {
    if (isNovaBooks) {
      return {
        name: "NovaBooks",
        title: "Mis Préstamos - NovaBooks",
        subtitle: "Gestiona tus préstamos activos en NovaBooks",
        primaryColor: "blue",
        bgGradient: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-200",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        textColor: "text-blue-800",
        booksPath: "/novabooks/books"
      }
    } else if (isTechShelf) {
      return {
        name: "TechShelf",
        title: "Mis Préstamos - TechShelf",
        subtitle: "Gestiona tus préstamos activos en TechShelf",
        primaryColor: "green",
        bgGradient: "from-green-50 to-teal-50",
        borderColor: "border-green-200",
        buttonColor: "bg-green-600 hover:bg-green-700",
        textColor: "text-green-800",
        booksPath: "/techshelf/books"
      }
    } else if (isKidVerse) {
      return {
        name: "KidVerse Reads",
        title: "Mis Préstamos - KidVerse Reads",
        subtitle: "Gestiona tus préstamos activos en KidVerse Reads",
        primaryColor: "orange",
        bgGradient: "from-orange-50 to-yellow-50",
        borderColor: "border-orange-200",
        buttonColor: "bg-orange-500 hover:bg-orange-600",
        textColor: "text-orange-800",
        booksPath: "/kidverse/books"
      }
    }
    
    // Default para rutas no específicas
    return {
      name: "MundoLibro.com",
      title: "Mis Préstamos Activos",
      subtitle: "Gestiona tus préstamos activos",
      primaryColor: "gray",
      bgGradient: "from-gray-50 to-white",
      borderColor: "border-gray-200",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      textColor: "text-gray-800",
      booksPath: "/books"
    }
  }

  const config = getLibraryConfig()

  useEffect(() => {
    if (!user) {
      // Redirigir a la página de login de la librería correspondiente
      if (isNovaBooks) {
        navigate("/novabooks/login")
      } else if (isTechShelf) {
        navigate("/techshelf/login")
      } else if (isKidVerse) {
        navigate("/kidverse/login")
      } else {
        navigate("/login")
      }
      return
    }

    const fetchActiveLoans = async () => {
      try {
        const loans = await loanService.getUserActiveLoans(user.id_usuario)
        setActiveLoans(loans)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching active loans:", error)
        setError("Failed to load your active loans. Please try again later.")
        setLoading(false)
      }
    }

    fetchActiveLoans()
  }, [user, navigate, isNovaBooks, isTechShelf, isKidVerse])

  const handleReturnBook = async (loanId: number, bookId: number) => {
    try {
      setReturningBook(loanId)
      await loanService.returnBook(loanId, bookId)

      // Update the active loans list
      setActiveLoans(activeLoans.filter((loan) => loan.id_prestamo !== loanId))

      setSuccess("Libro retornado con éxito!")
      setError("")
    } catch (error) {
      console.error("Error al retornar el libro:", error)
      setError("Fallo en retornar el libro. Intentalo más tarde.")
      setSuccess("")
    } finally {
      setReturningBook(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-${config.primaryColor}-500`}></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
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

        {activeLoans.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-${config.primaryColor}-100`}>
              <svg className={`w-10 h-10 text-${config.primaryColor}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.523-4.5-1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No tienes préstamos activos</h3>
            <p className="text-gray-500 mb-6">Actualmente no tienes ningún libro prestado.</p>
            <button 
              onClick={() => navigate(config.booksPath)} 
              className={`${config.buttonColor} text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg`}
            >
              Explorar Libros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeLoans.map((loan) => (
              <div key={loan.id_prestamo} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="md:flex">
                  <div className="md:w-1/3 p-4">
                    <div className="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={
                          loan.cover ||
                          `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(loan.titulo_libro) || "/placeholder.svg"}`
                        }
                        alt={loan.titulo_libro}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="md:w-2/3 p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">{loan.titulo_libro}</h3>
                    <p className="text-gray-600 mb-4">por {loan.autor_libro}</p>

                    <div className="space-y-3 mb-6">
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Prestado el</div>
                        <div className="font-semibold text-gray-800">
                          {new Date(loan.fecha_prestamo).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 font-medium">Fecha de vencimiento</div>
                        <div className={`font-semibold ${
                          new Date(loan.fecha_vencimiento) < new Date() 
                            ? 'text-red-600' 
                            : 'text-gray-800'
                        }`}>
                          {new Date(loan.fecha_vencimiento).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleReturnBook(loan.id_prestamo, loan.id_libro)}
                      disabled={returningBook === loan.id_prestamo}
                      className={`w-full ${config.buttonColor} text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg`}
                    >
                      {returningBook === loan.id_prestamo ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Procesando...
                        </div>
                      ) : (
                        "Retornar Libro"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyLoans
