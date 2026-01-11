import React, { useEffect, useRef, useState } from "react";
import skills from "./data";
import styles from "./styles.module.css";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";

export default function Skills(): JSX.Element {
  const skillsPerPage = 3;
  const totalPages = Math.max(1, Math.ceil(skills.length / skillsPerPage));
  const { withBaseUrl } = useBaseUrlUtils();

  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  const containerRef = useRef<HTMLDivElement | null>(null); // visible viewport
  const wrapperRef = useRef<HTMLDivElement | null>(null); // slides wrapper
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // detect mobile
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // measure using ResizeObserver so we don't get 0 width races
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") {
      // fallback: measure once
      setContainerWidth(el?.clientWidth ?? 0);
      return;
    }

    const ro = new ResizeObserver(() => {
      // use clientWidth directly
      const w = el.clientWidth;
      if (w && w !== containerWidth) {
        setContainerWidth(w);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current]);

  // apply pixel widths and transform when containerWidth / page / totalPages change
  useEffect(() => {
    const w = containerWidth;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // if width is zero, don't set (avoids collapsing)
    if (w <= 0) return;

    // explicit pixel widths
    wrapper.style.width = `${totalPages * w}px`;
    Array.from(wrapper.children).forEach((child: Element) => {
      (child as HTMLElement).style.width = `${w}px`;
    });

    // equalize card heights per page so all cards share identical height
    try {
      const pages = Array.from(wrapper.children) as HTMLElement[];
      pages.forEach((p) => {
        const cards = Array.from(p.querySelectorAll(`.${styles.mobileCard}`)) as HTMLElement[];
        if (cards.length === 0) return;
        const heights = cards.map((c) => c.offsetHeight || c.getBoundingClientRect().height || 0);
        const maxH = heights.reduce((a, b) => Math.max(a, b), 0);
        cards.forEach((c) => {
          (c as HTMLElement).style.height = `${maxH}px`;
          (c as HTMLElement).style.minHeight = `${maxH}px`;
        });
      });
    } catch (e) {
      // ignore
    }

    const offset = -page * w;
    wrapper.style.transition = "transform 320ms ease";
    wrapper.style.transform = `translateX(${offset}px)`;
    // Equalize heights to avoid vertical jumps while swiping
    // allow natural height for measurement
    wrapper.style.height = "auto";
    try {
      const pages = Array.from(wrapper.children) as HTMLElement[];
      // compute natural heights
      const pageHeights = pages.map((p) => p.offsetHeight || p.getBoundingClientRect().height);
      const maxPageHeight = pageHeights.reduce((a, b) => Math.max(a, b), 0);
      if (maxPageHeight > 0) {
        // lock wrapper height to the tallest page to prevent jumps
        wrapper.style.height = `${maxPageHeight}px`;
      }
    } catch (e) {
      // non-fatal
    }
  }, [containerWidth, page, totalPages]);

  // keep page valid when totalPages changes
  useEffect(() => {
    if (page > totalPages - 1) setPage(Math.max(0, totalPages - 1));
  }, [totalPages, page]);

  // touch handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchEndX.current = null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) return;
    const delta = touchStartX.current - touchEndX.current;
    const threshold = 40;
    if (delta > threshold && page < totalPages - 1) setPage((p) => p + 1);
    if (delta < -threshold && page > 0) setPage((p) => p - 1);
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // render helpers
  const renderDesktop = () => (
    <div className={styles.grid}>
      {skills.map((s) => (
        <article
          key={s.id}
          className={styles.card}
          onMouseEnter={() => setFlipped((p) => ({ ...p, [s.id]: true }))}
          onMouseLeave={() => setFlipped((p) => ({ ...p, [s.id]: false }))}
          role="button"
          tabIndex={0}
        >
          <div className={`${styles.cardInner} ${flipped[s.id] ? styles.rotate : ""}`}>
            <div className={styles.front}>
              {s.iconUrl && <img src={withBaseUrl(s.iconUrl)} alt={s.title} className={styles.icon} />}
              <div className={styles.cardTitle}>{s.title}</div>
            </div>
            <div className={styles.back}>
              <p>How I used this skill</p>
              <ul>
                {s.description.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  const renderMobile = () => (
    <>
      {/* wrapperRef will be measured and sized by effect */}
      <div
        ref={wrapperRef}
        className={styles.mobileSwipeWrapper}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {Array.from({ length: totalPages }).map((_, pageIndex) => {
          const start = pageIndex * skillsPerPage;
          const pageSkills = skills.slice(start, start + skillsPerPage);
          // pageSkills: rendered for this page
          return (
            <div key={pageIndex} className={styles.mobilePage}>
              {pageSkills.map((s) => (
                <div key={s.id} className={styles.mobileCard}>
                  <div className={styles.mobileRow}>
                    <div>
                      {s.iconUrl && <img src={withBaseUrl(s.iconUrl)} alt={s.title} className={styles.icon} />}
                      <div className={styles.cardTitle} title={s.title}>{s.title}</div>
                    </div>
                    <div>
                      {s.description && (
                        <ul>
                          {s.description.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className={styles.indicatorWrapper}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${page === i ? styles.activeDot : ""}`}
              onClick={() => setPage(i)}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );

  // only render mobile markup when container width known to avoid 0px races
  const readyToRenderMobile = isMobile ? containerWidth > 0 : true;

  return (
    <section ref={containerRef} id="skills" className={styles.container}>
      <h2 className={styles.title}>My skills</h2>
      {!isMobile && renderDesktop()}
      {isMobile && readyToRenderMobile && renderMobile()}
    </section>
  );
}