import './style.css';

import { useState } from 'react';

const SwitchButton = ({ onSwitch }) => {
  const [active, setActive] = useState('Post');

  const handleClick = (e) => {
    const name = e.target.innerText;
    setActive(name);
    if (typeof onSwitch === 'function') onSwitch(name);
  };
  return (
    <div className='button-wrapper mb-3 mt-3'>
      <button
        className={active === 'Post' ? 'active' : ''}
        onClick={handleClick}
      >
        Post
      </button>
      <button
        className={active === 'Comment' ? 'active' : ''}
        onClick={handleClick}
      >
        Comment
      </button>
    </div>
  );
};

export default SwitchButton;
