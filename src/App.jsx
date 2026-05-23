import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import CulinaryStyle from './components/CulinaryStyle'
import Experiences from './components/Experiences'
import Gallery from './components/Gallery'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

// Adds the .is-visible class to every .reveal element as it scrolls into
// view, triggering the subtle fade-in animation defined in index.css.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function App() {
  useReveal()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <CulinaryStyle />
        <Experiences />
        <Gallery />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
