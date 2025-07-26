import { useEffect } from 'react';

export function useScrollReveal(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    // Safety check - make sure ref exists and has current property
    if (!ref || !ref.current) return;
    
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-5');
        }
      },
      { threshold: 0.2 }
    );

    el.classList.add('opacity-0', 'translate-y-5', 'transition-all', 'duration-700', 'ease-out');
    io.observe(el);
    
    return () => io.disconnect();
  }, [ref]);
} 