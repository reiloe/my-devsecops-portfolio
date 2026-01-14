import React, { useState } from 'react';
import navData from './data';
import styles from './styles.module.css';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';

function MobileMenu({ open, onClose }: Readonly<{ open: boolean; onClose: () => void }>) {
  const { withBaseUrl } = useBaseUrlUtils();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (to.startsWith('#')) {
      e.preventDefault();
      document.getElementById(to.substring(1))?.scrollIntoView({ behavior: 'smooth' });
    }
    onClose();
  };

  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.close}>✕</button>
        <nav className={styles.mobileNav}>
          {navData.links.map((l) => (
            <a key={l.label} href={l.to.startsWith('#') ? l.to : withBaseUrl(l.to)} onClick={(e) => handleLinkClick(e, l.to)} className={styles.mobileLink}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function Header(): JSX.Element {
  const { withBaseUrl } = useBaseUrlUtils();
  const [open, setOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (to.startsWith('#')) {
      e.preventDefault();
      document.getElementById(to.substring(1))?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.desktopNav}>
          {navData.links.map((l) => (
            <a key={l.label} href={l.to.startsWith('#') ? l.to : withBaseUrl(l.to)} className={styles.link} onClick={(e) => handleLinkClick(e, l.to)}>
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