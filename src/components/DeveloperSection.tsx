import React, { useRef } from 'react';
import Button from './Button';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface DeveloperSectionProps {
  onJoinClick: () => void;
}

const DeveloperSection: React.FC<DeveloperSectionProps> = ({ onJoinClick }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section 
      ref={sectionRef}
      id="demo"
      className="bg-black py-20"
      data-reveal
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <p className="text-accent text-sm font-medium mb-4 uppercase tracking-wide">
              
            </p>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Bagira AI<br />
              Попробуйте сами<br />
            </h2>
            
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Узнайте, как Bagira AI взаимодействует<br />
             с потенциальными клиентами. <br />
             Нажмите на иконку микрофона <br />
             и запишитесь на консультацию.<br />
            </p>
            
            <Button 
              variant="primary" 
              className="text-lg px-8 py-4"
              onClick={onJoinClick}
            >
              Присоединиться к пилотной программе
            </Button>
          </div>

          {/* Right Column - Illustration */}
          <div className="relative">
            <div className="flex items-center justify-center">
              {/* Phone with Bitcoin app */}
              <div className="relative">
                <img 
                  src="/src/assets/phone.svg" 
                  alt="Phone illustration" 
                  className="h-80 w-auto"
                />
              </div>
            </div>

            {/* See what being built text */}
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Инновации</h3>
              <h3 className="text-2xl font-bold text-white">в юридической мире</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperSection; 