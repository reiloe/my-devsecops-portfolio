import React, { useState } from 'react';
import styles from './styles.module.css';

type Props = { open: boolean; onClose: () => void };

export default function ContactOverlay({ open, onClose }: Props) {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose}>Close</button>
                <h3>Contact me</h3>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <textarea placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
}