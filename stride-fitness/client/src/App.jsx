import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Programs from './components/Programs'
import HowItWorks from './components/HowItWorks'
import Plans from './components/Plans'
import Join from './components/Join'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <Programs />
        <HowItWorks />
        <Plans />
        <Join />
      </main>
      <Footer />
    </>
  )
}

export default App