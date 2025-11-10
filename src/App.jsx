import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Footer from './components/Footer'
import Admin from './components/Admin'
import './App.css'

function HomePage({ config }) {
  return (
    <div className="App">
      <Header personal={config.personal} />
      <main>
        <Hero personal={config.personal} />
        <About about={config.about} />
        <Projects projects={config.projects} />
      </main>
      <Footer personal={config.personal} />
    </div>
  )
}

function App() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use Vite's base URL for correct path resolution
    const configPath = `${import.meta.env.BASE_URL}config.json`
    fetch(configPath)
      .then(response => response.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading config:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="error-container">
        <p>Error loading configuration. Please check config.json file.</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage config={config} />} />
      <Route path="/secret-admin-panel-xyz" element={<Admin />} />
    </Routes>
  )
}

export default App
