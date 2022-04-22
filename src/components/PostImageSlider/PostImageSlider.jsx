import { useState } from 'react';
import Lightbox from 'react-image-lightbox';


import './PostImageSlider.css'
import "react-image-lightbox/style.css";

function PostImageSlider({ data, isOpen, setIsOpen }) {
    let images = data && data.map(data => data?.secure_url)
    const [imageActive, setImageActive] = useState(0)
    return (
        <>
            {isOpen &&
                <Lightbox
                    mainSrc={images[imageActive]}
                    onCloseRequest={() => setIsOpen(false)}
                    nextSrc={images[(imageActive + 1) % images.length]}
                    prevSrc={images[(imageActive + images.length - 1) % images.length]}
                    onMoveNextRequest={() => {
                        setImageActive((imageActive + 1) % images.length)
                    }}
                    onMovePrevRequest={() => {
                        setImageActive((imageActive + images.length - 1) % images.length)
                    }}
                />}
        </>
    )
}

export default PostImageSlider