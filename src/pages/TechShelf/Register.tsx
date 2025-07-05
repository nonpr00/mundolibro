"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext.tsx"
import type { RegisterUserData } from "../../types"

const Register = () => {
  const [formData, setFormData] = useState<RegisterUserData & { confirmPassword: string }>({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.nombre || !formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    try {
      setError("")
      setLoading(true)

      await register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
      })

      navigate("/techshelf/books")
    } catch (error) {
      console.error("Registration error:", error)
      setError("Failed to create an account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-800">
            TechShelf
          </h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a nuestra comunidad de lectores
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="rounded-2xl shadow-xl p-8 bg-gradient-to-br from-green-50 to-teal-50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-500 focus:ring-green-200 focus:outline-none focus:ring-2 transition-all"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-500 focus:ring-green-200 focus:outline-none focus:ring-2 transition-all"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-500 focus:ring-green-200 focus:outline-none focus:ring-2 transition-all"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-500 focus:ring-green-200 focus:outline-none focus:ring-2 transition-all"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 bg-green-600 hover:bg-green-700 disabled:bg-green-400"
            >
              {loading ? "Creando cuenta..." : "Registrarse"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link 
                to="/techshelf/login" 
                className="font-medium hover:underline text-green-600 hover:text-green-700"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register 