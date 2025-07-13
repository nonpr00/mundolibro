import type { 
  Purchase, 
  RegisterPurchaseData, 
  RegisterPurchaseResponse,
  ListPurchasesData,
} from "../types"
import { API_CONFIG, getApiUrl } from "../config/api"
import { getAuthToken } from "./userService"

export const purchaseService = {
  // Register purchase - Real API call
  registerPurchase: async (purchaseData: RegisterPurchaseData): Promise<RegisterPurchaseResponse> => {
    try {
      const url = getApiUrl(API_CONFIG.COMPRAS_BASE_URL, API_CONFIG.ENDPOINTS.REGISTRAR_COMPRA)

      console.log("Registering purchase:", purchaseData)

      const token = getAuthToken()
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to register purchase')
      }

      const data: RegisterPurchaseResponse = await response.json()
      console.log("Purchase registered successfully:", data)

      return data
    } catch (error) {
      console.error('Register purchase error:', error)
      throw new Error('Failed to register purchase')
    }
  },

  // List purchases by user - Real API call
  listPurchasesByUser: async (listData: ListPurchasesData): Promise<Purchase[]> => {
    try {
      //const url = getApiUrl(API_CONFIG.COMPRAS_BASE_URL, API_CONFIG.ENDPOINTS.LISTAR_COMPRAS)

      const url = `${API_CONFIG.COMPRAS_BASE_URL}${API_CONFIG.ENDPOINTS.LISTAR_COMPRAS}?tenant_id=${listData.tenant_id}&username=${listData.username}`
      console.log("URL:", url)

      console.log("Fetching purchases for", listData.username, "in", listData.tenant_id)

      const token = getAuthToken()
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch purchases')
      }

      const data = await response.json()
      //const data: ListPurchasesResponse = await response.json()
      // Parse the body string to get the actual data
      const bodyData = JSON.parse(data.body)
      console.log("Purchases fetched successfully:", bodyData.compras)

      return bodyData.compras.map((compra: Purchase) => ({...compra, compra_id: compra["username#compra_id"].split('#')[1]}))
      
    } catch (error) {
      console.error('List purchases error:', error)
      return []
    }
  },

  // Get user total spent - Calculated from purchases
  getUserTotalSpent: async (username: string, tenant_id: string): Promise<number> => {
    try {
      const purchases = await purchaseService.listPurchasesByUser({ username, tenant_id })
      const total = purchases.reduce((sum, purchase) => sum + purchase.total, 0)

      console.log("Total spent for", username, ":", total)

      return total
    } catch (error) {
      console.error('Get user total spent error:', error)
      return 0
    }
  },

  // Get purchase by ID - Helper function
  getPurchaseById: async (compraId: string, tenant_id: string): Promise<Purchase | null> => {
    try {
      const purchases = await purchaseService.listPurchasesByUser({ 
        username: "", // filtro será manual
        tenant_id 
      })

      const purchase = purchases.find(p => p.compra_id === compraId)
      return purchase || null
    } catch (error) {
      console.error('Get purchase by ID error:', error)
      return null
    }
  }
}
