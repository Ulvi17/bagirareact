import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Metrics from './components/Metrics'
import FeatureCarousel from './components/FeatureCarousel'
import TeamSection from './components/TeamSection'
import DeveloperSection from './components/DeveloperSection'
import Footer from './components/Footer'
import JoinModal from './components/JoinModal'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJoinClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onJoinClick={handleJoinClick} />
      <main>
        <Hero onJoinClick={handleJoinClick} />
        <Metrics />
        <FeatureCarousel />
        <TeamSection />
        <DeveloperSection onJoinClick={handleJoinClick} />
      </main>
      <Footer />
      <JoinModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}

export default App 