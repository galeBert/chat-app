import React from 'react';

import clsxm from '../utils/clsxm';

export default function Loader({ size }) {
  // gray should apply on line 9
  return (
    <svg
      className={clsxm('animate-spin text-dark-9', `h-${size} w-${size}`)}
      fill='none'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle
        className='opacity-50'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      />
      <path
        className='opacity-75'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        fill='currentColor'
      />
    </svg>
  );
}
