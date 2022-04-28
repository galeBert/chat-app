import React from 'react';

import clsxm from '../utils/clsxm';

function Button({
  children,
  className,
  type = 'button',
  color = 'primary',
  icon,
  onClick,
  disabled,
}) {
  const lightButton = color === 'light' ? 'border-gray-300' : '';

  return (
    <button
      className={clsx(
        'flex flex-row w-full items-center justify-center mb-3 px-6 py-3 border border-transparent text-sm font-bold rounded-md shadow-sm text-white disabled:opacity-50 disabled:cursor-not-allowed',
        `${lightButton} bg-${color}-100 hover:bg-${color}-300 focus:bg-${color}-600`,
        className
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {icon}
      {children}
    </button>
  );
}

export default Button;
