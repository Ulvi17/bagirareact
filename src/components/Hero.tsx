import React, { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface HeroProps {
  onJoinClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoinClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);

  return (
    <section
      ref={ref}
      id="hero"
      className="bg-black rounded-b-[48px] text-center flex flex-col
                 items-center pt-40 pb-32 px-6 opacity-0 translate-y-5 transition"
    >
      <h1
        className="font-bold text-white leading-tight
                   [font-size:clamp(2.375rem,6vw,6rem)]"
      >
        Bagira AI<br />юрист для ваших клиентов
      </h1>

      <p className="mt-6 max-w-xl text-gray500 text-lg">
        Bagira AI — это AI-ассистент, который помогает вам автоматизировать процессы квалификация лидов, запись на консультацию и работу 24/7 без перерывов.
      </p>

      <button
        onClick={onJoinClick}
        className="mt-12 inline-flex items-center justify-center
                   bg-accent hover:bg-accentDark transition
                   h-14 px-10 rounded-full text-white font-medium"
      >
        Присоединиться к пилотной программе
      </button>

      {/* Ecosystem news chips */}
      <div className="mt-24 flex gap-6 overflow-x-auto snap-x snap-mandatory
                      px-6 lg:px-0">
        {['Мгновенная квалификация лидов','Автоматическая запись на консультацию','Работа 24/7 без перерывов'].map((text,idx)=>(
          <div key={idx}
               className="snap-start shrink-0 w-max flex items-center gap-3
                          bg-gray900/90 px-6 py-3 rounded-full shadow
                          text-white/90 text-sm">
            <span className="w-6 h-6 rounded-full bg-warn shrink-0"></span>
            {text}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero; 