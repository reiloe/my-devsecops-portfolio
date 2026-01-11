import React from 'react';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import ContactOverlayProvider from '../components/ContactOverlay/ContactOverlayProvider';
import '../css/landing.css';

export default function Home(): JSX.Element {
  return (
    <ContactOverlayProvider>

      <main>
        <Nav />
        <Hero />
        <Skills />
        <Projects />
        <Footer />
      </main>

    </ContactOverlayProvider>
  );
}