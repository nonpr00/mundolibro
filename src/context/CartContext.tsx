import { createContext, useContext, useState, useEffect } from "react"
import type { Cart, CartItem, Book } from "../types"

interface CartContextType {
  cart: Cart
  addToCart: (book: Book, cantidad?: number) => void
  removeFromCart: (libro_id: string) => void
  updateQuantity: (libro_id: string, cantidad: number) => void
  clearCart: () => void
  getCartItem: (libro_id: string) => CartItem | undefined
  isInCart: (libro_id: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

interface CartProviderProps {
  children: React.ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
        localStorage.removeItem("cart")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  }

  const calculateItemCount = (items: CartItem[]): number => {
    return items.reduce((count, item) => count + item.cantidad, 0)
  }

  const addToCart = (book: Book, cantidad: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.libro_id === book.libro_id)
      
      if (existingItem) {
        // Update existing item
        const updatedItems = prevCart.items.map(item =>
          item.libro_id === book.libro_id
            ? { ...item, cantidad: Math.min(item.cantidad + cantidad, book.stock) }
            : item
        )
        
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems)
        }
      } else {
        // Add new item
        const newItem: CartItem = {
          libro_id: book.libro_id,
          titulo: book.titulo,
          autor: book.autor,
          precio: book.precio,
          stock: book.stock,
          cover: book.cover,
          cantidad: Math.min(cantidad, book.stock)
        }
        
        const updatedItems = [...prevCart.items, newItem]
        
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems)
        }
      }
    })
  }

  const removeFromCart = (libro_id: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.libro_id !== libro_id)
      
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems)
      }
    })
  }

  const updateQuantity = (libro_id: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(libro_id)
      return
    }

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item =>
        item.libro_id === libro_id
          ? { ...item, cantidad: Math.min(cantidad, item.stock) }
          : item
      )
      
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems)
      }
    })
  }

  const clearCart = () => {
    setCart({
      items: [],
      total: 0,
      itemCount: 0
    })
  }

  const getCartItem = (libro_id: string): CartItem | undefined => {
    return cart.items.find(item => item.libro_id === libro_id)
  }

  const isInCart = (libro_id: string): boolean => {
    return cart.items.some(item => item.libro_id === libro_id)
  }

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem,
    isInCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
} 