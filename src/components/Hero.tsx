import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Lottie from 'lottie-react';
import MagicButton from './MagicButton';

interface HeroProps {
  onJoinClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoinClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [boltAnimation, setBoltAnimation] = useState(null);
  const [calendarAnimation, setCalendarAnimation] = useState(null);
  const [clockAnimation, setClockAnimation] = useState(null);
  useScrollReveal(ref);

  useEffect(() => {
    // Load all three animations
    Promise.all([
      fetch('/bolt bagira.json').then(response => response.json()),
      fetch('/calendar bagira.json').then(response => response.json()),
      fetch('/clock bagira.json').then(response => response.json())
    ])
    .then(([boltData, calendarData, clockData]) => {
      setBoltAnimation(boltData);
      setCalendarAnimation(calendarData);
      setClockAnimation(clockData);
    })
    .catch(error => console.error('Error loading animations:', error));
  }, []);

  const features = [
    {
      text: t('features.instant'),
      icon: boltAnimation ? (
        <Lottie 
          animationData={boltAnimation}
          className="w-12 h-12 sm:w-16 sm:h-16" 
          loop={true} 
          autoplay={true}
          style={{ width: '48px', height: '48px' }}
        />
      ) : (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-warn rounded flex items-center justify-center">
          <span className="text-2xl sm:text-3xl">⚡</span>
        </div>
      )
    },
    {
      text: t('features.booking'),
      icon: calendarAnimation ? (
        <Lottie 
          animationData={calendarAnimation}
          className="w-12 h-12 sm:w-16 sm:h-16" 
          loop={true} 
          autoplay={true}
          style={{ width: '48px', height: '48px' }}
        />
      ) : (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-warn rounded flex items-center justify-center">
          <span className="text-2xl sm:text-3xl">📅</span>
        </div>
      )
    },
    {
      text: t('features.workflow'),
      icon: clockAnimation ? (
        <Lottie 
          animationData={clockAnimation}
          className="w-12 h-12 sm:w-16 sm:h-16" 
          loop={true} 
          autoplay={true}
          style={{ width: '48px', height: '48px' }}
        />
      ) : (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-warn rounded flex items-center justify-center">
          <span className="text-2xl sm:text-3xl">🕐</span>
        </div>
      )
    }
  ];

  return (
    <section
      ref={ref}
      id="hero"
      className="bg-black rounded-b-[48px] text-center flex flex-col
                 items-center pt-20 sm:pt-32 lg:pt-40 pb-24 sm:pb-32 lg:pb-40 px-4 sm:px-6 opacity-0 translate-y-5 transition"
    >
      <h1
        className="font-bold text-white leading-tight
                   [font-size:clamp(2.375rem,6vw,6rem)]"
      >
        {t('hero.title')}<br />юрист для ваших клиентов
      </h1>

      <p className="mt-4 sm:mt-6 max-w-xl text-gray500 text-base sm:text-lg px-4">
        {t('hero.description')}
      </p>

      <MagicButton onClick={onJoinClick}>
        {t('hero.cta')}
      </MagicButton>

      {/* Ecosystem news chips */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-16 sm:mt-20">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide
                        px-4 sm:px-6 lg:px-0 pb-4 justify-center lg:justify-center">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="snap-start shrink-0 flex items-center gap-3
                         px-3 sm:px-4 py-2 rounded-full shadow-lg
                         text-white/90 text-xs sm:text-sm font-medium
                         min-w-max border border-gray-700/50"
              style={{ backgroundColor: 'rgba(9,9,9,255)' }}
            >
              {feature.icon}
              <span className="whitespace-nowrap">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
