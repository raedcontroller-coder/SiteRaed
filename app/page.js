"use client";
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Clients from '../components/Clients';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);

  const hideLoader = () => {
    setIsLoading(false);
    setTimeout(() => {
      setIsLoaderVisible(false);
    }, 500);
  };

  useEffect(() => {
    // Safety fallback just like loader.js
    const timer = setTimeout(() => {
      hideLoader();
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading Screen */}
      {isLoaderVisible && (
        <div id="loading-screen" style={{ opacity: isLoading ? 1 : 0, display: isLoaderVisible ? 'flex' : 'none' }}>
          <div className="loader-content">
            <img src="/assets/img/Logo.svg" alt="Raed" className="loader-logo" />
            <div className="loader-bar"></div>
          </div>
        </div>
      )}

      <Header openContactModal={() => setIsModalOpen(true)} />
      
      <Hero onVideoLoaded={hideLoader} />
      <About />
      <Services />
      <Clients />
      
      <Footer />

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
