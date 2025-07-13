import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext.tsx"
import { CartProvider } from "../context/CartContext.tsx"
import Navbar from "../components/Navbar.tsx"
import LandingPage from "../pages/LandingPage.tsx"

// KidVerse Reads Pages
import KidVerseHome from "../pages/KidVerseReads/Home.tsx"
import KidVerseLogin from "../pages/KidVerseReads/Login.tsx"
import KidVerseRegister from "../pages/KidVerseReads/Register.tsx"

// NovaBooks Pages
import NovaBooksHome from "../pages/NovaBooks/Home.tsx"
import NovaBooksLogin from "../pages/NovaBooks/Login.tsx"
import NovaBooksRegister from "../pages/NovaBooks/Register.tsx"

// TechShelf Pages
import TechShelfHome from "../pages/TechShelf/Home.tsx"
import TechShelfLogin from "../pages/TechShelf/Login.tsx"
import TechShelfRegister from "../pages/TechShelf/Register.tsx"

// Views
import Books from "../views/Books.tsx"
import BookDetail from "../views/BookDetail.tsx"
import UserProfile from "../views/UserProfile.tsx"
import MyPurchases from "../views/MyPurchases.tsx"
import Cart from "../views/Cart.tsx"

// Components
import About from "../components/About.tsx"

const AppRouter = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* KidVerse Reads Routes */}
                <Route path="/kidverse" element={<KidVerseHome />} />
                <Route path="/kidverse/login" element={<KidVerseLogin />} />
                <Route path="/kidverse/register" element={<KidVerseRegister />} />
                <Route path="/kidverse/books" element={<Books />} />
                <Route path="/kidverse/books/:id" element={<BookDetail />} />
                <Route path="/kidverse/profile" element={<UserProfile />} />
                <Route path="/kidverse/purchases" element={<MyPurchases />} />
                <Route path="/kidverse/cart" element={<Cart />} />

                {/* NovaBooks Routes */}
                <Route path="/novabooks" element={<NovaBooksHome />} />
                <Route path="/novabooks/login" element={<NovaBooksLogin />} />
                <Route path="/novabooks/register" element={<NovaBooksRegister />} />
                <Route path="/novabooks/books" element={<Books />} />
                <Route path="/novabooks/books/:id" element={<BookDetail />} />
                <Route path="/novabooks/profile" element={<UserProfile />} />
                <Route path="/novabooks/purchases" element={<MyPurchases />} />
                <Route path="/novabooks/cart" element={<Cart />} />

                {/* TechShelf Routes */}
                <Route path="/techshelf" element={<TechShelfHome />} />
                <Route path="/techshelf/login" element={<TechShelfLogin />} />
                <Route path="/techshelf/register" element={<TechShelfRegister />} />
                <Route path="/techshelf/books" element={<Books />} />
                <Route path="/techshelf/books/:id" element={<BookDetail />} />
                <Route path="/techshelf/profile" element={<UserProfile />} />
                <Route path="/techshelf/purchases" element={<MyPurchases />} />
                <Route path="/techshelf/cart" element={<Cart />} />

                {/* General Routes */}
                <Route path="/books" element={<Books />} />
                <Route path="/books/:id" element={<BookDetail />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/purchases" element={<MyPurchases />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About store="novabooks" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default AppRouter 