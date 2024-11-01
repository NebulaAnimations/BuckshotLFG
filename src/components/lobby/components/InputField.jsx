// components/lobby/components/InputField.jsx
import React from 'react';

export function InputField({ 
  label, 
  value, 
  onChange,
  error,
  className = '',
  type = 'text',
  ...props 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full bg-black border border-green-500 p-2 
                   focus:outline-none focus:border-green-400
                   ${error ? 'border-red-500' : ''}`}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && (
        <div className="mt-1 text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}