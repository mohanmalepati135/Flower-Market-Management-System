import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = ({ darkMode }) => {
  const { lang, setLang } = useLanguage();
  
  return (
    <div className={`flex gap-2 p-1 rounded-lg ${darkMode ? 'bg-black/20' : 'bg-gray-100'}`}>
      {['en', 'hi', 'te'].map(l => (
        <button 
          key={l} 
          onClick={() => setLang(l)} 
          className={`lang-btn px-3 py-1.5 rounded-md text-xs font-bold ${lang === l ? 'active' : 'inactive'}`}
        >
          {l === 'en' ? 'ENG' : l === 'hi' ? 'हिंदी' : 'తెలుగు'}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;