import React from 'react';
import styles from './styles.module.css';
import { Project } from '../Projects/data';

type Props = {
    project: Project;
    onOpenDoc: () => void;
    onOpenGitHub: () => void;
};

export default function MobileProjectCard({ project, onOpenDoc, onOpenGitHub }: Readonly<Props>) {
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>{project.short}</h2>

            <div className={styles.icons}>
                {project.icons?.map((i, idx) => <img key={idx} src={i} alt="icon" className={styles.icon} />)}
            </div>

            <img src={project.image} alt={project.title} className={styles.image} />

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
