import { useState, useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const QUOTES = [
  "Мы — небольшая команда, объединяющая глубокую корпоративно‑правовую экспертизу и практический опыт создания цифровых продуктов.",
  "Наш путь пролегает от университетских аудиторий и международных консалтинговых сделок до работы в венчурных студиях и запуска собственных стартапов.",
  "Bagira AI — квинтэссенция этого опыта: надёжное и масштабируемое IT‑решение, в котором юридическая точность сочетается с продуктовым мышлением."
];

const TeamSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((idx + 1) % QUOTES.length), 4500);
    return () => clearInterval(t);
  }, [idx]);

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-40 bg-accent text-white text-center"
      data-reveal
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <blockquote
          key={idx}
          className="mx-auto max-w-4xl text-xl lg:text-2xl font-medium leading-relaxed animate-fadeIn"
        >
          {QUOTES[idx]}
        </blockquote>
        
        <div className="mt-10 flex justify-center gap-3">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-4 h-4 rounded-full transition-all duration-300 relative ${
                i === idx ? "bg-white" : "bg-white/40 hover:bg-white/60"
              }`}
            >
              {/* Progress animation for active dot */}
              {i === idx && (
                <svg className="absolute inset-0 w-4 h-4 -rotate-90" viewBox="0 0 16 16">
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="37.7"
                    strokeDashoffset="37.7"
                    className="animate-progress"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection; 