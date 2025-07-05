import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "./App"
import "./index.css"
import { AuthProvider } from "./context/AuthContext.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)

/*
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { AuthProvider } from "./context/AuthContext"

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Failed to find the root element")

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
*/