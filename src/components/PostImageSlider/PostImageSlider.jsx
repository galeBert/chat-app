import './PostImageSlider.css';
import 'react-image-lightbox/style.css';

import { useState } from 'react';

import Lightbox from 'react-image-lightbox';

function PostImageSlider({ data, isOpen, setIsOpen }) {
  const images = data && data.map((datas) => datas?.secure_url);
  const [imageActive, setImageActive] = useState(0);
  return (
    <div>
      {isOpen && (
        <Lightbox
          mainSrc={images[imageActive]}
          nextSrc={images[(imageActive + 1) % images.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMoveNextRequest={() => {
            setImageActive((imageActive + 1) % images.length);
          }}
          onMovePrevRequest={() => {
            setImageActive((imageActive + images.length - 1) % images.length);
          }}
          prevSrc={images[(imageActive + images.length - 1) % images.length]}
        />
      )}
    </div>
  );
}

export default PostImageSlider;
