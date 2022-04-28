import React from 'react';

import clsx from '../utils/clsxm';

function Divider({ text, className }) {
  return (
    <div className={clsx('relative', className)}>
      <div aria-hidden='true' className='absolute inset-0 flex items-center'>
        <div className='w-full border-t border-gray-300' />
      </div>
      <div className='relative flex justify-center'>
        {text && (
          <span className='px-2 bg-gray-100 text-sm text-gray-600'>{text}</span>
        )}
      </div>
    </div>
  );
}

export default Divider;
