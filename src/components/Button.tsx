import React from 'react';
import type { ButtonProps } from '../types/ButtonTypes';

const Button: React.FC<ButtonProps> = ({ children, className = '', onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      className={`px-16 py-3 bg-primaryColor-900 hover:bg-accent-900 rounded-lg text-lg font-semibold transition ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
