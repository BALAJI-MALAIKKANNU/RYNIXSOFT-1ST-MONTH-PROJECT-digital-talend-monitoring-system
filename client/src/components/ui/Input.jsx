import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="mb-1 text-xs font-medium text-gray-700">{label}</label>}
      <input
        ref={ref}
        className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm
          ${error ? 'border-danger focus:ring-danger/30' : 'border-gray-200'}
        `}
        {...props}
      />
      {error && <span className="mt-1 text-xs text-danger">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
