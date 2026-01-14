import React, { useEffect } from 'react';
import Header from '../components/header';
import Hero from '../components/hero';
import Skills from '../components/skills';
import Projects from '../components/projects';
import Footer from '../components/footer';
import '../css/landing.css';

export default function Home(): JSX.Element {
  useEffect(() => {
    const root = document.getElementById('__docusaurus');
    if (root) root.classList.add('landing-page');
    return () => {
      if (root) root.classList.remove('landing-page');
    };
  }, []);

  return (
    <div className="landing-wrapper">
      <main>
        <Header />
        <Hero />
        <Skills />
        <Projects />
        <Footer />
      </main>
    </div>
  );
}