// API Configuration
export const API_CONFIG = {
  USUARIOS_BASE_URL: import.meta.env.VITE_API_USUARIOS || 'https://sgk3dn8z73.execute-api.us-east-1.amazonaws.com/prod/usuarios',
  COMPRAS_BASE_URL: import.meta.env.VITE_API_COMPRAS || 'https://t6aponb6ok.execute-api.us-east-1.amazonaws.com/prod/compras',
  PRODUCTOS_BASE_URL: import.meta.env.VITE_API_PRODUCTOS || 'https://5mmxjmyf40.execute-api.us-east-1.amazonaws.com/prod/productos',
  ENDPOINTS: {
    // Usuarios
    CREAR_USUARIO: '/crear',
    LOGIN_USUARIO: '/login',
    // Compras
    REGISTRAR_COMPRA: '/registrar',
    LISTAR_COMPRAS: '/listar',
    // Productos
    CREAR_PRODUCTO: '/crear',
    MODIFICAR_PRODUCTO: '/modificar',
    ELIMINAR_PRODUCTO: '/eliminar',
    LISTAR_PRODUCTOS: '/listar',
    BUSCAR_PRODUCTO: '/buscar'
  }
}

// Helper function to get full API URL
export const getApiUrl = (baseUrl: string, endpoint: string): string => {
  return `${baseUrl}${endpoint}`
} 