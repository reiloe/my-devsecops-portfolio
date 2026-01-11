import React, { useState } from 'react';
import navData from './data';
import styles from './styles.module.css';

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.close}>✕</button>
        <nav className={styles.mobileNav}>
          {navData.links.map((l) => (
            <a key={l.label} href={l.to} onClick={onClose} className={styles.mobileLink}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function Nav(): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.desktopNav}>
          {navData.links.map((l) => (
            <a key={l.label} href={l.to} className={styles.link}>
              {l.label}
            </a>
          ))}
        </nav>
        <button className={styles.burger} onClick={() => setOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}