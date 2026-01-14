import React from 'react';
import data from './data';
import styles from './styles.module.css';
import useIsMobile from '../../useIsMobile';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Hero() {
  const isMobile = useIsMobile();
  const avatarUrl = useBaseUrl(data.avatarUrl);

  const handleContactClick = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className={styles.hero}>
      {isMobile ? (
        <div className={styles.inner}>
          <p className={styles.small}>
            Hey there.
            {' '}<span className={styles.waveWrapper}>
              <span className={styles.wave}>👋</span>
            </span>
            {' '}I am
          </p>
          <h1 className={styles.name}>{data.name}</h1>
          <p className={styles.title}>{data.title}</p>
          <div className={styles.right}>
            <img src={avatarUrl} alt={data.name} className={styles.avatar} />
          </div>
          <p className={styles.desc}>{data.description}</p>
          <button className={styles.cta} onClick={handleContactClick}>Contact me</button>
        </div>
      ) : (
        <div className={styles.inner}>
          <div className={styles.left}>
            <p className={styles.small}>
              Hey there.
              {' '}<span className={styles.waveWrapper}>
                <span className={styles.wave}>👋</span>
              </span>
              {' '}I am
            </p>
            <h1 className={styles.name}>{data.name}</h1>
            <p className={styles.title}>{data.title}</p>
            <p className={styles.desc}>{data.description}</p>
            <button className={styles.cta} onClick={handleContactClick}>Contact me</button>
          </div>
          <div className={styles.right}>
            <img src={avatarUrl} alt={data.name} className={styles.avatar} />
          </div>
        </div>
      )}
    </section>
  );
}