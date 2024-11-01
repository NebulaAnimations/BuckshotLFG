// components/lobby/components/Button.jsx
import React from 'react';

export function Button({ 
  children, 
  onClick, 
  disabled = false, 
  className = '',
  variant = 'primary',
  ...props 
}) {
  const baseClasses = 'border transition-colors disabled:opacity-50 p-2';
  const variantClasses = {
    primary: 'border-green-500 hover:bg-green-500 hover:text-black',
    secondary: 'border-green-700 hover:bg-green-700 hover:text-black',
    danger: 'border-red-500 hover:bg-red-500 hover:text-black'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}