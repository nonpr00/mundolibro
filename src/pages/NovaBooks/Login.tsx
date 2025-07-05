import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext.tsx"

const Login = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    try {
      setError("")
      setLoading(true)
      await login(email, password)
      navigate("/novabooks/books")
    } catch (error) {
      console.error("Login error:", error)
      setError("Failed to log in. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-800">
            NovaBooks
          </h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu cuenta para continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="rounded-2xl shadow-xl p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-200 focus:outline-none focus:ring-2 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-200 focus:outline-none focus:ring-2 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link 
                to="/novabooks/register" 
                className="font-medium hover:underline text-blue-600 hover:text-blue-700"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 