import React from 'react';
import styles from './styles.module.css';
import { Project } from '../projects/data';
import useBaseUrl, { useBaseUrlUtils } from '@docusaurus/useBaseUrl';

type Props = {
    project: Project;
    onClose: () => void;
    onOpenDoc: () => void;
    onOpenGitHub: () => void;
};

export default function ProjectCard({ project, onClose, onOpenDoc, onOpenGitHub }: Readonly<Props>) {
    const { withBaseUrl } = useBaseUrlUtils();

    return (
        <div className={styles.card}>
            <div className={styles.card_container}>
                <div className={styles.card_left}>
                    <h1 className={styles.card_title}>{project.short}</h1>
                    <img src={useBaseUrl(project.image)} alt={project.title} className={styles.image} />
                </div>

                <div className={styles.card_right}>
                    <div className={styles.icons}>
                        {project.icons?.map((i, idx) => <img key={idx} src={withBaseUrl(i)} alt="icon" className={styles.icon} />)}
                    </div>
                    <div className={styles.description}>
                        <p dangerouslySetInnerHTML={{ __html: project.long || '' }} />
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.doc} onClick={onOpenDoc}>Documentation</button>
                        <button className={styles.git} onClick={onOpenGitHub}>GitHub</button>
                    </div>
                </div>
            </div>
        </div>
    );
}