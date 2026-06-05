import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import HeroBio from './components/HeroBio'
import Services from './components/Services'
import Experiences from './components/Experiences'
import Gallery from './components/Gallery'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import { LanguageProvider } from './i18n/LanguageContext'
import { ContentProvider } from './content/ContentContext'
import AdminApp from './admin/AdminApp'

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

function PublicSite() {
  useReveal()
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HeroBio />
        <Services />
        <Experiences />
        <Gallery />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <ContentProvider>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<PublicSite />} />
        </Routes>
      </ContentProvider>
    </LanguageProvider>
  )
}
