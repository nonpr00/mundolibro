import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext.tsx"
import { useCart } from "../context/CartContext.tsx"
import { purchaseService } from "../services/purchaseService"
import { bookService } from "../services/bookService"
import type { RegisterPurchaseData } from "../types"

const Cart = () => {
  const { user } = useAuth()
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [loading, setLoading] = useState<boolean>(false)
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
        title: "Carrito de Compras - NovaBooks",
        subtitle: "Revisa tus productos antes de comprar",
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
        title: "Carrito de Compras - TechShelf",
        subtitle: "Revisa tus productos antes de comprar",
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
        title: "Carrito de Compras - KidVerse Reads",
        subtitle: "Revisa tus productos antes de comprar",
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
      title: "Carrito de Compras",
      subtitle: "Revisa tus productos antes de comprar",
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

  const handleCheckout = async () => {
    if (!user) {
      navigate(config.loginPath)
      return
    }

    if (cart.items.length === 0) {
      setError("El carrito está vacío")
      return
    }

    try {
      setLoading(true)
      setError("")
      setSuccess("")

      const purchaseData: RegisterPurchaseData = {
        tenant_id: user.tenant_id,
        username: user.username,
        items: cart.items.map(item => ({
          libro_id: item.libro_id,
          cantidad: item.cantidad
        })),
        total: cart.total
      }

      await purchaseService.registerPurchase(purchaseData)
      
      // Update stock for all purchased items
      for (const item of cart.items) {
        await bookService.updateBook({
          tenant_id: user.tenant_id,
          //item.libro_id.split('_')[0] === 'LIB' ? 'KidVerse' : 'NovaBooks', // Mock tenant detection
          libro_id: item.libro_id,
          precio: item.precio,
          stock: item.stock - item.cantidad
        })
      }
      
      setSuccess("¡Compra realizada exitosamente!")
      clearCart()
      
      // Redirect to purchases page after a short delay
      setTimeout(() => {
        navigate(`/${user.tenant_id.toLocaleLowerCase()}/purchases`)
      }, 2000)

    } catch (error) {
      console.error("Error during checkout:", error)
      setError("Error al procesar la compra. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (cart.items.length === 0) {
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

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-${config.primaryColor}-100`}>
              <svg className={`w-10 h-10 text-${config.primaryColor}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tu carrito está vacío</h3>
            <p className="text-gray-500 mb-6">Agrega algunos libros para comenzar a comprar.</p>
            <button 
              onClick={() => navigate(config.booksPath)} 
              className={`${config.buttonColor} text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg`}
            >
              Explorar Libros
            </button>
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

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Productos en el carrito ({cart.itemCount})</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {cart.items.map((item) => (
              <div key={item.libro_id} className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.cover || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"}
                      alt={item.titulo}
                      className="w-16 h-20 object-cover rounded"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {item.titulo}
                    </h3>
                    <p className="text-sm text-gray-600">{item.autor}</p>
                    <p className="text-lg font-bold text-emerald-600 mt-1">
                      ${item.precio.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.libro_id, item.cantidad - 1)}
                      disabled={item.cantidad <= 1}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <span className="w-12 text-center font-medium">{item.cantidad}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.libro_id, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.libro_id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-emerald-600">${cart.total.toFixed(2)}</span>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(config.booksPath)}
                className="flex-1 py-3 px-4 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
              >
                Seguir Comprando
              </button>
              
              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`flex-1 py-3 px-4 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${config.buttonColor}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  "Finalizar Compra"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart 