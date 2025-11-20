import React from 'react';
import { useTranslation } from 'react-i18next';
import "./language-switcher.css"

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className='language-switcher'>
      <span 
        className={`language-link ${i18n.language === 'en' ? 'active' : ''}`} 
        onClick={() => changeLanguage('en')}
      >
        EN
      </span>
      <span className='separator'>|</span>
      <span 
        className={`language-link ${i18n.language === 'es' ? 'active' : ''}`} 
        onClick={() => changeLanguage('es')}
      >
        ES
      </span>
    </div>
  );
};
