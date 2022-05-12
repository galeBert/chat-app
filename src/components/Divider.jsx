import React from 'react';

import clsxm from '../utils/clsxm';

function Divider({ text, className }) {
  return (
    <div className={clsxm('relative', className)}>
      <div aria-hidden='true' className='absolute inset-0 flex items-center'>
        <div className='w-full border-t border-gray-300' />
      </div>
      <div className='relative flex justify-center'>
        {text && (
          <span className='px-2 bg-dark-9 text-sm text-typography-2'>
            {text}
          </span>
        )}
      </div>
    </div>
  );
}

export default Divider;
