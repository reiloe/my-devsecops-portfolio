import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function ConfigValue({ field }: Readonly<{ field: string }>): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    const value = siteConfig.customFields?.[field];

    // Fallback, falls die Variable nicht gesetzt ist
    if (!value) {
        return <span style={{ color: 'red', fontWeight: 'bold' }}>[MISSING: {field}]</span>;
    }

    return <>{value}</>;
}
