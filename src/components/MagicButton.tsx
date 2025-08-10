import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MagicButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const MagicButton: React.FC<MagicButtonProps> = ({ children, onClick, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [buttonDimensions, setButtonDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Get button dimensions and calculate path
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonDimensions({ width: rect.width, height: rect.height });
    }
  }, [isHovered]);

  useEffect(() => {
    // Calculate path length after dimensions are set
    if (pathRef.current && buttonDimensions.width > 0) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [buttonDimensions]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Generate path based on button dimensions with exact rounded borders
  const generatePath = () => {
    const { width, height } = buttonDimensions;
    if (width === 0 || height === 0) return '';
    
    const radius = height / 2;
    const strokeWidth = 3;
    const offset = strokeWidth / 2;
    
    // Create a path that follows the exact rounded rectangle border
    return `M ${radius + offset} ${offset} 
            L ${width - radius - offset} ${offset} 
            A ${radius} ${radius} 0 0 1 ${width - offset} ${radius + offset} 
            L ${width - offset} ${height - radius - offset} 
            A ${radius} ${radius} 0 0 1 ${width - radius - offset} ${height - offset} 
            L ${radius + offset} ${height - offset} 
            A ${radius} ${radius} 0 0 1 ${offset} ${height - radius - offset} 
            L ${offset} ${radius + offset} 
            A ${radius} ${radius} 0 0 1 ${radius + offset} ${offset}`;
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden
        h-14 sm:h-16 px-8 sm:px-12 rounded-full 
        text-white font-medium text-base sm:text-lg
        shadow-lg hover:shadow-xl
        mt-8 sm:mt-12
        ${className}
      `}
      animate={{
        scale: isHovered ? 1.05 : [1, 1.02, 1],
        boxShadow: isHovered 
          ? '0 25px 50px -12px rgba(89,71,251,0.4)' 
          : [
              '0 10px 15px -3px rgba(89,71,251,0.25)',
              '0 15px 25px -3px rgba(89,71,251,0.3)',
              '0 10px 15px -3px rgba(89,71,251,0.25)'
            ]
      }}
      transition={{
        scale: {
          duration: isHovered ? 0.1 : 2,
          repeat: isHovered ? 0 : Infinity,
          ease: "easeInOut"
        },
        boxShadow: {
          duration: isHovered ? 0.1 : 2,
          repeat: isHovered ? 0 : Infinity,
          ease: "easeInOut"
        }
      }}
      style={{
        backgroundColor: isHovered ? 'rgba(89,71,251,0.8)' : 'rgba(89,71,251,255)',
        transform: isHovered 
          ? `translate(${(mousePosition.x - buttonDimensions.width/2) * 0.05}px, ${(mousePosition.y - buttonDimensions.height/2) * 0.05}px)`
          : 'translate(0px, 0px)',
      }}
    >
      {/* Border Tracer SVG - Only on idle */}
      {!isHovered && buttonDimensions.width > 0 && (
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ mixBlendMode: 'screen' }}
          width="100%"
          height="100%"
          viewBox={`0 0 ${buttonDimensions.width} ${buttonDimensions.height}`}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <motion.path
            ref={pathRef}
            d={generatePath()}
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
            style={{ opacity: 0.6 }}
            strokeDasharray={pathLength > 0 ? `${pathLength * 0.15} ${pathLength}` : "0"}
            animate={{ strokeDashoffset: [0, -pathLength] }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "linear"
            }}
          />
        </svg>
      )}

      {/* Magnetic glow effect */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-full blur-xl pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, rgba(89,71,251,0.3), rgba(89,71,251,0.1))',
            transform: `translate(${(mousePosition.x - buttonDimensions.width/2) * 0.1}px, ${(mousePosition.y - buttonDimensions.height/2) * 0.1}px)`,
          }}
        />
      )}

      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default MagicButton; 