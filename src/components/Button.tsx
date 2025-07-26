import React from 'react';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  onClick, 
  className = '' 
}) => {
  const baseClasses = 'px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer inline-block text-center';
  
  const variantClasses = {
    primary: 'bg-accent hover:bg-accentDark text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    secondary: 'bg-gray900 hover:bg-gray-800 text-white'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button; 