import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "../components/Navbar"
import LandingPage from "../pages/LandingPage"
import Books from "../views/Books"
import BookDetail from "../views/BookDetail"
import MyLoans from "../views/MyLoans"
import UserProfile from "../views/UserProfile"

// NovaBooks
import NovaBooksHome from "../pages/NovaBooks/Home"
import NovaBooksLogin from "../pages/NovaBooks/Login"
import NovaBooksRegister from "../pages/NovaBooks/Register"

// TechShelf
import TechShelfHome from "../pages/TechShelf/Home"
import TechShelfLogin from "../pages/TechShelf/Login"
import TechShelfRegister from "../pages/TechShelf/Register"

// KidVerse Reads
import KidVerseHome from "../pages/KidVerseReads/Home"
import KidVerseLogin from "../pages/KidVerseReads/Login"
import KidVerseRegister from "../pages/KidVerseReads/Register"

const AppRouter = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Landing Page - Solo para usuarios no autenticados, sin navbar */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Rutas con navbar */}
          <Route path="/*" element={
            <>
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  {/* NovaBooks */}
                  <Route path="/novabooks/home" element={<NovaBooksHome />} />
                  <Route path="/novabooks/login" element={<NovaBooksLogin />} />
                  <Route path="/novabooks/register" element={<NovaBooksRegister />} />
                  <Route path="/novabooks/books" element={<Books />} />
                  <Route path="/novabooks/books/:id" element={<BookDetail />} />
                  <Route path="/novabooks/profile" element={<UserProfile />} />
                  <Route path="/novabooks/my-loans" element={<MyLoans />} />
                  
                  {/* TechShelf */}
                  <Route path="/techshelf/home" element={<TechShelfHome />} />
                  <Route path="/techshelf/login" element={<TechShelfLogin />} />
                  <Route path="/techshelf/register" element={<TechShelfRegister />} />
                  <Route path="/techshelf/books" element={<Books />} />
                  <Route path="/techshelf/books/:id" element={<BookDetail />} />
                  <Route path="/techshelf/profile" element={<UserProfile />} />
                  <Route path="/techshelf/my-loans" element={<MyLoans />} />
                  
                  {/* KidVerse Reads */}
                  <Route path="/kidverse/home" element={<KidVerseHome />} />
                  <Route path="/kidverse/login" element={<KidVerseLogin />} />
                  <Route path="/kidverse/register" element={<KidVerseRegister />} />
                  <Route path="/kidverse/books" element={<Books />} />
                  <Route path="/kidverse/books/:id" element={<BookDetail />} />
                  <Route path="/kidverse/profile" element={<UserProfile />} />
                  <Route path="/kidverse/my-loans" element={<MyLoans />} />
                </Routes>
              </main>
              <footer className="bg-gray-800 text-white p-4 text-center">
                <p>© 2025 MundoLibro.com - Tu portal de lectura digital</p>
              </footer>
            </>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default AppRouter 