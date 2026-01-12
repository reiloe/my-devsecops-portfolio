import React from 'react';
import Header from '../components/header';
import Hero from '../components/hero';
import Skills from '../components/skills';
import Projects from '../components/projects';
import Footer from '../components/footer';
import ContactOverlayProvider from '../components/contact-overlay/ContactOverlayProvider';
import '../css/landing.css';

export default function Home(): JSX.Element {
  return (
    <ContactOverlayProvider>

      <main>
        <Header />
        <Hero />
        <Skills />
        <Projects />
        <Footer />
      </main>

    </ContactOverlayProvider>
  );
}