import React, { createContext, useContext, useState } from 'react';
import ContactOverlay from './index';

type ContextType = { openContact: () => void; closeContact: () => void; isOpen: boolean };
const Ctx = createContext<ContextType | undefined>(undefined);

export default function ContactOverlayProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <Ctx.Provider value={{ openContact: () => setOpen(true), closeContact: () => setOpen(false), isOpen: open }}>
            {children}
            <ContactOverlay open={open} onClose={() => setOpen(false)} />
        </Ctx.Provider>
    );
}

export function useContact() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useContact must be used within ContactOverlayProvider');
    return ctx;
}