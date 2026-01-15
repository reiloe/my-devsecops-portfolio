import React from 'react';
import styles from './styles.module.css';
import { Project } from '../projects/data';
import useBaseUrl, { useBaseUrlUtils } from '@docusaurus/useBaseUrl';


type Props = {
    project: Project;
    onOpenDoc: () => void;
    onOpenGitHub: () => void;
};

export default function MobileProjectCard({ project, onOpenDoc, onOpenGitHub }: Readonly<Props>) {
    const { withBaseUrl } = useBaseUrlUtils();
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>{project.short}</h2>

            <div className={styles.icons}>
                {project.icons?.map((i, idx) => <img key={idx} src={withBaseUrl(i)} alt="icon" className={styles.icon} />)}
            </div>

            <img src={useBaseUrl(project.image)} alt={project.title} className={styles.image} />

            <div className={styles.description}>
                <p>{project.long}</p>
            </div>

            <div className={styles.actions}>
                <button className={styles.doc} onClick={onOpenDoc}>Documentation</button>
                <button className={styles.git} onClick={onOpenGitHub}>GitHub</button>
            </div>
        </div>
    );
}
