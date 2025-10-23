

import React from 'react';

const LANGS = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'pt', label: 'Português' }
];

function LanguageSelector({ lang, setLang }) {
    return (
        <select
            className="language-selector"
            value={lang}
            onChange={e => setLang(e.target.value)}
            style={{
                background: '#fffbe6',
                color: '#1a2a44',
                border: '1px solid #ffe066',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '1rem',
                fontWeight: '400'
            }}
        >
            {LANGS.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
            ))}
        </select>
    );
}

export default LanguageSelector;
