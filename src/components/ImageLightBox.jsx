import Lightbox from 'react-image-lightbox';

const ImageLightBox = ({ data, isOpen, setIsOpen }) => {
    let photoList = []
    let parse = data && data.map(data => JSON.parse(data).secure_url)
    return (
        <div>
            {isOpen && <Lightbox
                mainSrc={parse[0]}
                // nextSrc={parse[(0 + 1) % images.length]}
                // prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                onCloseRequest={() => setIsOpen(false)}
            // onMovePrevRequest={() =>
            //     this.setState({
            //         photoIndex: (photoIndex + images.length - 1) % images.length,
            //     })
            // }
            // onMoveNextRequest={() =>
            //     this.setState({
            //         photoIndex: (photoIndex + 1) % images.length,
            //     })
            // }
            />}
        </div>
    );
}

export default ImageLightBox;