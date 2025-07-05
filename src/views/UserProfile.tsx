import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.tsx"
import { userService } from "../services/userService"
import { loanService } from "../services/loanService"
import type { User, Loan } from "../types"

const UserProfile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [userData, setUserData] = useState<User | null>(null)
  const [loanHistory, setLoanHistory] = useState<Loan[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    const fetchUserData = async () => {
      try {
        const userData = await userService.getUserById(user.id_usuario)
        const loans = await loanService.getUserLoanHistory(user.id_usuario)

        setUserData(userData)
        setLoanHistory(loans)
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
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
            {userData.nombre.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{userData.nombre}</h2>
            <p className="text-gray-600">{userData.email}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Miembro desde</p>
              <p className="font-medium">{new Date(userData.fecha_registro).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Total de libros prestados</p>
              <p className="font-medium">{loanHistory.length}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Historial de Prestamos</h2>

      {loanHistory.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Todavia no has pedido un libro, pidelo en: </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libros</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dia de Prestamo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dia de Retorno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loanHistory.map((loan) => (
                <tr key={loan.id_prestamo}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{loan.titulo_libro}</div>
                    <div className="text-sm text-gray-500">{loan.autor_libro}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(loan.fecha_prestamo).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {loan.fecha_devolucion
                        ? new Date(loan.fecha_devolucion).toLocaleDateString()
                        : "No retornado aun"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        loan.fecha_devolucion ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {loan.fecha_devolucion ? "Retornado" : "Activo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default UserProfile
