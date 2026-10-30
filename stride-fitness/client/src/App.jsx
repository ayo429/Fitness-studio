import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthDialogProvider } from './context/AuthDialog'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Programs from './components/Programs'
import HowItWorks from './components/HowItWorks'
import Plans from './components/Plans'
import Join from './components/Join'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import CheckoutSuccess from './pages/CheckoutSuccess'

// The landing page: all the sections stacked on one page, as before
function Home() {
  return (
    <main id="top">
      <Hero />
      <Programs />
      <HowItWorks />
      <Plans />
      <Join />
    </main>
  )
}

// With several pages, the browser no longer scrolls for us. Whenever the address
// changes, jump to the section named after the # (like /#plans), or to the top.
function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    const id = location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [location])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <AuthDialogProvider>
        <ScrollManager />
        <ToastContainer position="top-right" autoClose={4000} />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          {/* Any other address goes back to the home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </AuthDialogProvider>
    </BrowserRouter>
  )
}

export default App