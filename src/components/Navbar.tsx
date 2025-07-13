import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.tsx"
import { useCart } from "../context/CartContext.tsx"

const Navbar = () => {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  // Determinar en qué librería estamos basándonos en la URL
  const isNovaBooks = location.pathname.startsWith('/novabooks')
  const isTechShelf = location.pathname.startsWith('/techshelf')
  const isKidVerse = location.pathname.startsWith('/kidverse')

  // Configuración de colores y rutas para cada librería
  const getLibraryConfig = () => {
    if (isNovaBooks) {
      return {
        name: "NovaBooks",
        tenant_id: "novabooks",
        primaryColor: "blue",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700",
        textColor: "text-blue-600",
        booksPath: "/novabooks/books",
        profilePath: "/novabooks/profile",
        loginPath: "/novabooks/login",
        registerPath: "/novabooks/register",
        purchasesPath: "/novabooks/purchases",
        cartPath: "/novabooks/cart"
      }
    } else if (isTechShelf) {
      return {
        name: "TechShelf",
        tenant_id: "techshelf",
        primaryColor: "green",
        bgColor: "bg-green-600",
        hoverColor: "hover:bg-green-700",
        textColor: "text-green-600",
        booksPath: "/techshelf/books",
        profilePath: "/techshelf/profile",
        loginPath: "/techshelf/login",
        registerPath: "/techshelf/register",
        purchasesPath: "/techshelf/purchases",
        cartPath: "/techshelf/cart"
      }
    } else if (isKidVerse) {
      return {
        name: "KidVerse Reads",
        tenant_id: "kidverse",
        primaryColor: "orange",
        bgColor: "bg-orange-500",
        hoverColor: "hover:bg-orange-600",
        textColor: "text-orange-600",
        booksPath: "/kidverse/books",
        profilePath: "/kidverse/profile",
        loginPath: "/kidverse/login",
        registerPath: "/kidverse/register",
        purchasesPath: "/kidverse/purchases",
        cartPath: "/kidverse/cart"
      }
    }

    // Default para rutas no específicas
    return {
      name: "MundoLibro.com",
      tenant_id: "",
      primaryColor: "gray",
      bgColor: "bg-gray-600",
      hoverColor: "hover:bg-gray-700",
      textColor: "text-gray-600",
      booksPath: "/books",
      profilePath: "/profile",
      loginPath: "/login",
      registerPath: "/register",
      purchasesPath: "/purchases",
      cartPath: "/cart"
    }
  }

  const config = getLibraryConfig()
  console.log(isKidVerse, isNovaBooks, isTechShelf)

  return (isKidVerse || isNovaBooks || isTechShelf) ? (
    <nav className={`${config.bgColor} text-white shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            {/* Logo/Brand */}
            <Link to={config.tenant_id} className="text-xl font-bold">
              {config.name}
            </Link>
            {/* Volver a MundoLibro.com */}
            {!user ? (<Link
              to={"/"}
              className="bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-2"
            >
              Volver a MundoLibro.com
            </Link>) : null}
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {
              user && (
                <Link
                  to={config.booksPath}
                  className="hover:text-gray-300 transition-colors"
                >
                  Libros
                </Link>
              )
            }


            {user && (
              <>
                <Link
                  to={config.purchasesPath}
                  className="hover:text-gray-300 transition-colors"
                >
                  Mis Compras
                </Link>
                <Link
                  to={config.profilePath}
                  className="hover:text-gray-300 transition-colors"
                >
                  Mi Perfil
                </Link>
              </>
            )}
          </div>

          {/* User Menu and Cart */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            {user ? (<Link
              to={config.cartPath}
              className="relative hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              {cart.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Link>) : null}

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Hola, {user.username}</span>
                <button
                  onClick={() => {
                    logout()
                    navigate(config.loginPath || "/")
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to={`${location.pathname.split('/')[1]}/login`}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to={`${location.pathname.split('/')[1]}/register`}
                  className="bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  ) : null;
}

export default Navbar
