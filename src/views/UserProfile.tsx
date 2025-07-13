import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.tsx"
import { purchaseService } from "../services/purchaseService"
import type { User } from "../types"

const UserProfile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [userData, setUserData] = useState<User | null>(null)
  const [totalSpent, setTotalSpent] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!user) {
      navigate(`/${location.pathname.split('/')[1]}/login`)
      return
    }

    const fetchUserData = async () => {
      try {
        const userData = user
        const total = await purchaseService.getUserTotalSpent(user.username, user.tenant_id)

        setUserData(userData)
        setTotalSpent(total)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to load user data. Please try again later.")
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user, navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">User data not available. Please log in again.</p>
        <button onClick={logout} className="btn btn-primary mt-4">
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 mt-10">Mi Perfil</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
            {userData.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{userData.username}</h2>
            <p className="text-gray-600">Tenant: {userData.tenant_id}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Total gastado en compras</p>
              <p className="font-medium text-lg text-emerald-600">${totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Para ver tu historial de compras, visita la sección "Mis Compras" en el menú.
        </p>
        <button 
          onClick={() => navigate("/books")}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Explorar Libros
        </button>
      </div>
    </div>
  )
}

export default UserProfile
