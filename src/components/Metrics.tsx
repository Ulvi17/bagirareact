import { useRef } from 'react';
import Button from './Button';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Metrics: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef);

  const scrollToDemo = () => {
    const element = document.getElementById('demo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="bg-white py-20"
      data-reveal
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray900 mb-6 leading-tight">
              Время менять<br />
              статус-кво<br />
              для юристов
            </h2>
            
            <p className="text-lg text-gray500 mb-8 leading-relaxed">
              Современные технологии открывают новые возможности<br />
              для юридической практики и взаимодействия с клиентами.<br />
              Пора использовать инновации для развития бизнеса.
            </p>
            
            <Button 
              variant="primary" 
              className="text-lg px-8 py-4"
              onClick={scrollToDemo}
            >
              Попробовать Bagira AI
            </Button>
          </div>

          {/* Right Column - YouTube Video */}
          <div className="relative">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black transform scale-110">
              {/* Responsive aspect ratio container */}
              <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 aspect ratio */}
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/4dS_mAogd1s?rel=0&showinfo=0&modestbranding=1"
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Metrics; 