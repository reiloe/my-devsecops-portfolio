import React from 'react';
import styles from './styles.module.css';
import { footerData } from './data';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const iconMap: Record<string, JSX.Element> = {
    FaLinkedin: <FaLinkedin />,
    FaGithub: <FaGithub />,
    FaTwitter: <FaTwitter />,
};

export default function Footer(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    const { legalEmail, legalPhone, legalName } = siteConfig.customFields as { legalEmail?: string; legalPhone?: string; legalName?: string };

    const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <div className={styles.footerWrapper}>
            <footer id="contact" className={styles.wrapper} aria-labelledby="footer-heading">
                <div className={styles.top}>
                    <div className={styles.contact}>
                        <h3 className={styles.heading}>Contact Me</h3>
                        <p className={styles.contactItem}><strong>Email:</strong> <a href={`mailto:${legalEmail || footerData.contact.email}`} className={styles.link}>{legalEmail || footerData.contact.email}</a></p>
                        <p className={styles.contactItem}><strong>Phone:</strong> {legalPhone || footerData.contact.phone}</p>
                    </div>

                    <div className={styles.social}>
                        <h3 className={styles.heading}>Social</h3>
                        <ul className={styles.socialList}>
                            {footerData.social.map((s) => (
                                <li key={s.label}>
                                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                        {iconMap[s.icon]}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.middle}>
                    <button className={styles.mybtn} onClick={handleBackToTop}>
                        <svg width="50" height="20" viewBox="0 0 50 20">
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7"
                                    refX="0" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="white" />
                                </marker>
                            </defs>

                            <polyline points="0,10 30,10" stroke="white" stroke-width="2"
                                fill="none" marker-end="url(#arrowhead)" />
                        </svg>

                    </button>

                </div>

                <div className={styles.bottom}>
                    <p className={styles.copy}>&copy; {new Date().getFullYear()} {legalName || "Your Name"}. All rights reserved.</p>
                    <p className={styles.legal}>
                        <Link to="/legal-information" style={{ color: 'inherit', textDecoration: 'none' }}>{footerData.legal}</Link>
                        {' · '}
                        <Link to="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>{footerData.privacy}</Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}