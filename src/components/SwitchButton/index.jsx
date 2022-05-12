import { useState } from 'react';

import clsxm from '../../utils/clsxm';

const SwitchButton = ({ onSwitch }) => {
  const [active, setActive] = useState('Post');

  const handleClick = (e) => {
    const name = e.target.innerText;
    setActive(name);
    if (typeof onSwitch === 'function') onSwitch(name);
  };

  const activeButton = (key) => {
    return clsxm('w-full rounded-sm text-typography-1', {
      'w-full bg-brand-1 rounded-md': active === key,
    });
  };
  return (
    <div className='w-full h-10 bg-dark-1 rounded-lg flex border-2 border-solid border-dark-9 mb-3 mt-3'>
      <button className={activeButton('Post')} onClick={handleClick}>
        Post
      </button>
      <button className={activeButton('Comment')} onClick={handleClick}>
        Comment
      </button>
    </div>
  );
};

export default SwitchButton;
