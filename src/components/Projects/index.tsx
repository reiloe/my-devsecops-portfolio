import React, { useState } from 'react';
import projects from './data';
import styles from './styles.module.css';
import useIsMobile from '../../useIsMobile';
import ProjectCard from '../ProjectCard';
import MobileProjectCard from '../MobileProjectCard';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';

export default function Projects() {
    const { withBaseUrl } = useBaseUrlUtils();

    const openDoc = (docId?: string) => {
        if (!docId) return;
        window.location.href = withBaseUrl(`/docs/${docId}`);
    };

    const openGitHub = (url?: string) => {
        if (!url) return;
        window.open(url, '_blank', 'noopener');
    };

    const [current, setCurrent] = useState<string>(projects[0].id);
    const currentProject = projects.find((p) => p.id === current);

    const isMobile = useIsMobile();
    const itemsToShow = isMobile ? 3 : 5;

    // Wenn Hook noch nicht initialisiert, zeige basierend auf matchMedia
    if (isMobile === null) {
        const mediaQuery = typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)') : null;
        const isSmall = mediaQuery?.matches ?? false;

        if (!isSmall) {
            return null; // Desktop beim Loading - warte auf Hook
        }

        // Mobile beim Loading - zeige direkt
        return (
            <section id="projects" className={styles.container}>
                <h2 className={styles.title}>My project highlights</h2>
                <div className={styles.mobile_projects_container}>
                    {projects.slice(0, 3).map((project, idx) => (
                        <div key={project.id}>
                            <MobileProjectCard
                                project={project}
                                onOpenDoc={() => openDoc("projects/" + project.docId)}
                                onOpenGitHub={() => openGitHub(project.githubUrl)}
                            />
                            {idx < 2 && <div className={styles.divider} />}
                        </div>
                    ))}
                </div>
                <div className={styles.see_more_section}>
                    <button className={styles.see_more_btn} onClick={() => openDoc('projects/overview')}>See more projects</button>
                </div>
            </section>
        );
    }

    // Nach Hook-Initialisierung
    if (isMobile) {
        return (
            <section id="projects" className={styles.container}>
                <h2 className={styles.title}>My project highlights</h2>
                <div className={styles.mobile_projects_container}>
                    {projects.slice(0, itemsToShow).map((project, idx) => (
                        <div key={project.id}>
                            <MobileProjectCard
                                project={project}
                                onOpenDoc={() => openDoc("projects/" + project.docId)}
                                onOpenGitHub={() => openGitHub(project.githubUrl)}
                            />
                            {idx < itemsToShow - 1 && <div className={styles.divider} />}
                        </div>
                    ))}
                </div>
                <div className={styles.see_more_section}>
                    <p>If you want to see more projects click on the button below.</p>
                    <button className={styles.see_more_btn} onClick={() => openDoc('/docs/projects/overview')}>See more projects</button>
                </div>
            </section>
        );
    }

    // Desktop
    return (
        <section id="projects" className={styles.container}>
            <h2 className={styles.title}>Project highlights</h2>
            <div className={styles.project_highlights}>
                <div className={styles.highlight_links_container}>
                    <div className={styles.highlight_links}>
                        <ol>
                            {projects.slice(0, itemsToShow).map((p) => (
                                <li key={p.id}>
                                    <button
                                        className={styles.highlight_btn}
                                        onClick={() => setCurrent(p.id)}
                                    >
                                        {p.title}
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className={styles.more_projects}>
                        <svg width="30" height="40" viewBox="0 0 30 40">
                            <polyline points="0,0 0,15 20,15" stroke="white" strokeWidth="2" fill="none" />
                            <polyline points="10,10 20,15 10,20" stroke="white" strokeWidth="2" fill="none" />
                        </svg>
                        <a className={styles.highlight_link} href={withBaseUrl('/docs/projects/overview')}>see more projects</a>
                    </div>
                </div>
                <div className={styles.highlight_cards_container}>
                    {currentProject && (
                        <ProjectCard
                            project={currentProject}
                            onClose={() => setCurrent(null)}
                            onOpenDoc={() => openDoc("projects/" + currentProject.docId)}
                            onOpenGitHub={() => openGitHub(currentProject.githubUrl)}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}