# Configuración de Variables de Entorno

Este archivo contiene las variables de entorno necesarias para el funcionamiento del sistema de biblioteca.

## Variables Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# API Usuarios (Autenticación)
VITE_API_USUARIOS=https://sgk3dn8z73.execute-api.us-east-1.amazonaws.com/prod/usuarios

# API Compras
VITE_API_COMPRAS=https://sgk3dn8z73.execute-api.us-east-1.amazonaws.com/prod/compras

# API Productos (Libros)
VITE_API_PRODUCTOS=https://5mmxjmyf40.execute-api.us-east-1.amazonaws.com/prod/productos
```

## Descripción de las APIs

### API Usuarios
- **Base URL**: `VITE_API_USUARIOS`
- **Funciones**: Crear usuario, login
- **Endpoints**: `/crear`, `/login`

### API Compras
- **Base URL**: `VITE_API_COMPRAS`
- **Funciones**: Registrar compra, listar compras
- **Endpoints**: `/registrar`, `/listar`

### API Productos
- **Base URL**: `VITE_API_PRODUCTOS`
- **Funciones**: Listar productos, buscar producto, modificar producto
- **Endpoints**: `/productos/listar`, `/productos/buscar_codigo`, `/producto/modificar`

## Configuración por Librería

El sistema soporta múltiples librerías (tenants) con diferentes configuraciones:

### KidVerse Reads
- **Tenant ID**: `"KidVerse"`
- **Especialización**: Libros infantiles
- **URLs**: `/kidverse/*`

### NovaBooks
- **Tenant ID**: `"NovaBooks"`
- **Especialización**: Libros generales
- **URLs**: `/novabooks/*`

### TechShelf
- **Tenant ID**: `"TechShelf"`
- **Especialización**: Libros técnicos
- **URLs**: `/techshelf/*`

## Ejemplo de Archivo .env

```env
# Configuración de APIs
VITE_API_USUARIOS=https://sgk3dn8z73.execute-api.us-east-1.amazonaws.com/prod/usuarios
VITE_API_COMPRAS=https://sgk3dn8z73.execute-api.us-east-1.amazonaws.com/prod/compras
VITE_API_PRODUCTOS=https://5mmxjmyf40.execute-api.us-east-1.amazonaws.com/prod/productos
```

## Estructura de Datos de Libros

### Campos Obligatorios para Crear un Libro
```json
{
  "tenant_id": "KidVerse",
  "libro_id": "LIB001",
  "titulo": "Destino de mañana",
  "autor": "Dr. Seuss",
  "precio": 10.99,
  "stock": 200,
  "descripcion": "Un libro inspirador sobre las posibilidades de la vida y el futuro."
}
```

### Respuesta de Listar Libros
```json
{
  "statusCode": 200,
  "body": {
    "productos": [
      {
        "tenant_id": "KidVerse",
        "libro_id": "LIB001",
        "titulo": "Destino de mañana",
        "autor": "Dr. Seuss",
        "precio": 10.99,
        "stock": 200,
        "descripcion": "Un libro inspirador sobre las posibilidades de la vida y el futuro."
      }
    ]
  }
}
```

## Notas Importantes

1. **Autenticación**: Todas las APIs requieren el token de autorización obtenido al hacer login
2. **Multi-tenant**: Cada librería tiene su propio `tenant_id`
3. **Variables de entorno**: Deben comenzar con `VITE_` para ser accesibles en el frontend
4. **Desarrollo**: Si no se configuran las variables, se usan las URLs por defecto

## Ejemplo de uso

```bash
# En la raíz del proyecto
cp ENV_SETUP.md .env
# Editar .env con las URLs correctas
npm run dev
```

## Verificación

Para verificar que las variables están configuradas correctamente:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Ejecuta: `console.log(import.meta.env.VITE_API_USUARIOS)`
4. Ejecuta: `console.log(import.meta.env.VITE_API_COMPRAS)`
5. Ejecuta: `console.log(import.meta.env.VITE_API_PRODUCTOS)`

Deberías ver las URLs configuradas en lugar de `undefined`.

## Troubleshooting

### Error: "Failed to fetch"
- Verifica que las URLs sean correctas
- Asegúrate de que las APIs estén funcionando
- Revisa la consola del navegador para errores específicos

### Error: "Variable not defined"
- Verifica que el archivo `.env` esté en la raíz del proyecto
- Asegúrate de que las variables comiencen con `VITE_`
- Reinicia el servidor de desarrollo después de modificar `.env`

### Error: "Book not found"
- Verifica que el libro_id y tenant_id coincidan
- Asegúrate de que el libro exista en la base de datos
- Revisa los logs del servicio para más detalles 