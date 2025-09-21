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
        >
            {LANGS.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
            ))}
        </select>
    );
}

export default LanguageSelector;
