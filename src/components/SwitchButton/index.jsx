import { useState } from 'react';
import './style.css'
const SwitchButton = ({ onSwitch }) => {
    const [active, setActive] = useState('Post')

    const handleClick = (e) => {
        const name = e.target.innerText
        setActive(name)
        if (typeof onSwitch === 'function') onSwitch(name)
    }
    return (
        <div className="button-wrapper mb-3 mt-3">
            <button onClick={handleClick} className={active === 'Post' && 'active'}>Post</button>
            <button onClick={handleClick} className={active === 'Comment' && 'active'} >Comment</button>
        </div>
    );
}

export default SwitchButton
