import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext.tsx"
import { purchaseService } from "../services/purchaseService"
import type { Purchase } from "../types"

const MyPurchases = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  // Determinar en qué librería estamos basándonos en la URL
  const isNovaBooks = location.pathname.startsWith('/novabooks')
  const isTechShelf = location.pathname.startsWith('/techshelf')
  const isKidVerse = location.pathname.startsWith('/kidverse')
  
  // Configuración de colores y rutas para cada librería
  const getLibraryConfig = () => {
    if (isNovaBooks) {
      return {
        name: "NovaBooks",
        title: "Mis Compras - NovaBooks",
        subtitle: "Historial de tus compras en NovaBooks",
        primaryColor: "blue",
        bgGradient: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-200",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        textColor: "text-blue-800",
        booksPath: "/novabooks/books",
        loginPath: "/novabooks/login",
        registerPath: "/novabooks/register"
      }
    } else if (isTechShelf) {
      return {
        name: "TechShelf",
        title: "Mis Compras - TechShelf",
        subtitle: "Historial de tus compras en TechShelf",
        primaryColor: "green",
        bgGradient: "from-green-50 to-teal-50",
        borderColor: "border-green-200",
        buttonColor: "bg-green-600 hover:bg-green-700",
        textColor: "text-green-800",
        booksPath: "/techshelf/books",
        loginPath: "/techshelf/login",
        registerPath: "/techshelf/register"
      }
    } else if (isKidVerse) {
      return {
        name: "KidVerse Reads",
        title: "Mis Compras - KidVerse Reads",
        subtitle: "Historial de tus compras en KidVerse Reads",
        primaryColor: "orange",
        bgGradient: "from-orange-50 to-yellow-50",
        borderColor: "border-orange-200",
        buttonColor: "bg-orange-500 hover:bg-orange-600",
        textColor: "text-orange-800",
        booksPath: "/kidverse/books",
        loginPath: "/kidverse/login",
        registerPath: "/kidverse/register"
      }
    }
    
    // Default para rutas no específicas
    return {
      name: "MundoLibro.com",
      title: "Mis Compras",
      subtitle: "Historial de tus compras",
      primaryColor: "gray",
      bgGradient: "from-gray-50 to-white",
      borderColor: "border-gray-200",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      textColor: "text-gray-800",
      booksPath: "/books",
      loginPath: "/login",
      registerPath: "/register"
    }
  }

  const config = getLibraryConfig()

  useEffect(() => {
    if (!user) {
      navigate(config.loginPath)
      return
    }

    const fetchPurchases = async () => {
      try {
        setLoading(true)
        setError("")
        
        const userPurchases = await purchaseService.listPurchasesByUser({ tenant_id: user.tenant_id, username: user.username })
        setPurchases(userPurchases)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching purchases:", error)
        setError("Failed to load purchase history. Please try again later.")
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [user, navigate, config.loginPath])


  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-${config.primaryColor}-500`}></div>
          </div>
        </div>
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


        {purchases.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-${config.primaryColor}-100`}>
              <svg className={`w-10 h-10 text-${config.primaryColor}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No tienes compras registradas</h3>
            <p className="text-gray-500 mb-6">Aún no has realizado ninguna compra en esta librería.</p>
            <button 
              onClick={() => navigate(config.booksPath)} 
              className={`${config.buttonColor} text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg`}
            >
              Explorar Libros
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Historial de Compras</h2>
              <p className="text-sm text-gray-600 mt-1">Total de compras: {purchases.length}</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <div key={purchase.compra_id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Compra #{purchase.compra_id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(purchase.timestamp).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Libros comprados:</h4>
                    <div className="space-y-2">
                      {purchase.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">
                            {item.libro_id} (x{item.cantidad}) 
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Total de la compra:</span>
                    <span className="text-lg font-bold text-gray-800">
                      ${purchase.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPurchases 