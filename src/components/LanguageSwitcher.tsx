import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      {/* English button temporarily hidden */}
      {/* <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          i18n.language === 'en' 
            ? 'bg-accent text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button> */}
      <button
        onClick={() => changeLanguage('ru')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          i18n.language === 'ru' 
            ? 'bg-accent text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        RU
      </button>
    </div>
  );
};

export default LanguageSwitcher;
