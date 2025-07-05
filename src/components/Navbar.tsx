"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.tsx"

const Navbar = () => {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
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
        bgGradient: "bg-gradient-to-r from-blue-600 to-indigo-600",
        primaryColor: "blue",
        homePath: "/novabooks/home",
        booksPath: "/novabooks/books",
        profilePath: "/novabooks/profile",
        loansPath: "/novabooks/my-loans",
        loginPath: "/novabooks/login",
        registerPath: "/novabooks/register"
      }
    } else if (isTechShelf) {
      return {
        name: "TechShelf",
        bgGradient: "bg-gradient-to-r from-green-600 to-teal-600",
        primaryColor: "green",
        homePath: "/techshelf/home",
        booksPath: "/techshelf/books",
        profilePath: "/techshelf/profile",
        loansPath: "/techshelf/my-loans",
        loginPath: "/techshelf/login",
        registerPath: "/techshelf/register"
      }
    } else if (isKidVerse) {
      return {
        name: "KidVerse Reads",
        bgGradient: "bg-gradient-to-r from-orange-500 to-yellow-500",
        primaryColor: "orange",
        homePath: "/kidverse/home",
        booksPath: "/kidverse/books",
        profilePath: "/kidverse/profile",
        loansPath: "/kidverse/my-loans",
        loginPath: "/kidverse/login",
        registerPath: "/kidverse/register"
      }
    }
    
    // Default para rutas no específicas
    return {
      name: "MundoLibro.com",
      bgGradient: "bg-gradient-to-r from-gray-600 to-gray-700",
      primaryColor: "gray",
      homePath: "/",
      booksPath: "/books",
      profilePath: "/profile",
      loansPath: "/my-loans",
      loginPath: "/login",
      registerPath: "/register"
    }
  }

  const config = getLibraryConfig()

  // Función personalizada para logout que redirige a la librería correspondiente
  const handleLogout = () => {
    logout()
    // Redirigir a la página de login de la librería correspondiente
    navigate(config.loginPath)
  }

  return (
    <nav className={`shadow-lg ${config.bgGradient}`}>
      <div className="container mx-auto px-8">
        <div className="flex justify-between items-center py-4">
          <Link to={config.homePath} className="text-2xl font-bold text-white hover:text-gray-100 transition-colors">
            {config.name}
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to={config.homePath} className="px-3 py-2 text-sm font-medium text-white hover:text-gray-100 hover:bg-white/10 rounded-md transition-colors">
              Inicio
            </Link>
            
            <Link to={config.booksPath} className="px-3 py-2 text-sm font-medium text-white hover:text-gray-100 hover:bg-white/10 rounded-md transition-colors">
              Libros
            </Link>

            {user ? (
              <>
                <Link to={config.loansPath} className="px-3 py-2 text-sm font-medium text-white hover:text-gray-100 hover:bg-white/10 rounded-md transition-colors">
                  Mis Préstamos
                </Link>
                
                <Link to={config.profilePath} className="px-3 py-2 text-sm font-medium text-white hover:text-gray-100 hover:bg-white/10 rounded-md transition-colors">
                  Mi Perfil
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to={config.loginPath} className="px-3 py-2 text-sm font-medium text-white hover:text-gray-100 hover:bg-white/10 rounded-md transition-colors">
                  Entrar
                </Link>
                <Link to={config.registerPath} className={`bg-white text-${config.primaryColor}-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors`}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <Link to={config.homePath} className="block py-2 text-white hover:text-gray-100">
              Inicio
            </Link>
            
            <Link to={config.booksPath} className="block py-2 text-white hover:text-gray-100">
              Libros
            </Link>

            {user ? (
              <>
                <Link to={config.loansPath} className="block py-2 text-white hover:text-gray-100">
                  Mis Préstamos
                </Link>
                
                <Link to={config.profilePath} className="block py-2 text-white hover:text-gray-100">
                  Mi Perfil
                </Link>
                
                <button onClick={handleLogout} className="block w-full text-left py-2 text-white hover:text-gray-100">
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to={config.loginPath} className="block py-2 text-white hover:text-gray-100">
                  Entrar
                </Link>
                <Link to={config.registerPath} className="block py-2 text-white hover:text-gray-100">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
