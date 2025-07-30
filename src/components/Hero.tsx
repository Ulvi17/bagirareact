import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { BoltIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/solid';

interface HeroProps {
  onJoinClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoinClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  useScrollReveal(ref);

  const features = [
    {
      text: t('features.instant'),
      icon: <BoltIcon className="w-4 h-4 sm:w-6 sm:h-6 text-warn" />
    },
    {
      text: t('features.booking'),
      icon: <CalendarDaysIcon className="w-4 h-4 sm:w-6 sm:h-6 text-warn" />
    },
    {
      text: t('features.workflow'),
      icon: <ClockIcon className="w-4 h-4 sm:w-6 sm:h-6 text-warn" />
    }
  ];

  return (
    <section
      ref={ref}
      id="hero"
      className="bg-black rounded-b-[48px] text-center flex flex-col
                 items-center pt-20 sm:pt-32 lg:pt-40 pb-20 sm:pb-24 lg:pb-32 px-4 sm:px-6 opacity-0 translate-y-5 transition"
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

      <button
        onClick={onJoinClick}
        className="mt-8 sm:mt-12 inline-flex items-center justify-center
                   bg-accent hover:bg-accentDark transition
                   h-12 sm:h-14 px-6 sm:px-10 rounded-full text-white font-medium text-sm sm:text-base"
      >
        {t('hero.cta')}
      </button>

      {/* Ecosystem news chips */}
      <div className="mt-16 sm:mt-20 lg:mt-24 w-full">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide
                        px-4 sm:px-6 lg:px-0 pb-4 justify-center lg:justify-center">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="snap-start shrink-0 flex items-center gap-3
                         bg-gray900/90 px-4 sm:px-6 py-3 rounded-full shadow-lg
                         text-white/90 text-xs sm:text-sm font-medium
                         min-w-max border border-gray-700/50"
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
