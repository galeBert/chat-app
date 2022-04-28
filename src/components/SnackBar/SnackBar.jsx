import './SnackBar.css';

import { useEffect } from 'react';

import { CheckIcon, XIcon } from '@heroicons/react/outline';

const SnackBar = ({ isShown, setCloseSnackBar, children, ...props }) => {
  useEffect(() => {
    if (isShown)
      setTimeout(() => {
        setCloseSnackBar(false);
      }, 2900);
  }, [setCloseSnackBar, isShown]);

  return (
    <div className={`snackbar-container ${isShown && 'show'}`}>
      <div className={`snackbar-content `}>
        {props.status === 'Error' ? (
          <div className='w-6 h-6 p-1 mr-3 bg-red-100 rounded-full'>
            <XIcon />
          </div>
        ) : (
          <div className='w-6 h-6 p-1 mr-3 bg-green-300 rounded-full'>
            <CheckIcon />
          </div>
        )}
        <div>{children}</div>

        {isShown && (
          <div className='ml-4'>
            <div className='circular'>
              <div className='inner' />
              <div className='outer' />

              <div className='circle'>
                <div className='bar left'>
                  <div className='progress' />
                </div>
                <div className='bar right'>
                  <div className='progress' />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnackBar;
