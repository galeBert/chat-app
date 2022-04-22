import { Gif, VideoOverlay } from '@giphy/react-components';
import { XIcon } from '@heroicons/react/outline';
import PostImageSlider from 'components/PostImageSlider/PostImageSlider';
import { useState } from 'react';
const Media = ({ media, ...props }) => {

    const traslatedMedia = []
    media?.content && media?.content.map(data => traslatedMedia.push(JSON.parse(data)))
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenGif, setIsOpenGif] = useState(false)
    let mediaRender;
    switch (media?.type) {

        case "image":
            mediaRender = (
                <div className={`flex justify-center gap-${props.gap || 1}`}>
                    {traslatedMedia && traslatedMedia.map((data, key) => {
                        return <img
                            onClick={() => setIsOpen(true)}
                            key={key}
                            src={data?.secure_url}
                            alt="img_err"
                            style={{ width: `${props.width || 20}px`, height: `${props.height || 20}px` }}
                            className={` rounded object-cover`} />
                    })
                    }
                    <PostImageSlider data={traslatedMedia} isOpen={isOpen} setIsOpen={setIsOpen} />

                </div>
            );
            break;
        case "gif":
            mediaRender = isOpenGif ? (
                <div className='absolute z-50 top-0 left-0 w-full h-full bg-opacity-60 bg-dark-100 flex justify-center items-center'>
                    <button onClick={() => setIsOpenGif(false)} className='w-10 h-10 absolute right-5 top-5'><XIcon /></button>
                    <div className=' w-96 h-72'>
                        {traslatedMedia.map((data, key) => <Gif
                            hideAttribution
                            noLink
                            key={key}
                            gif={data}
                            width={"100%"}
                            height={"100%"}
                            overlay={data.type === 'video' ? VideoOverlay : null}
                            className='cursor-pointer rounded-md'
                        />)}
                    </div>
                </div>
            ) : (
                <div >
                    {traslatedMedia.map((data, key) => <Gif
                        hideAttribution
                        noLink
                        key={key}
                        gif={data}
                        width={props.width * 2 || 20}
                        height={props.height * 2 || 20}
                        overlay={data.type === 'video' ? VideoOverlay : null}
                        className='cursor-pointer rounded-md border border-gray-300 dark:border-dark-50'
                        onGifClick={() => {
                            setIsOpenGif(true)
                        }}
                    />)}
                </div>
            )

            break;
        default:
            mediaRender = null
    }


    return (
        <div className="flex justify-center gap-1">
            {mediaRender}
        </div>
    );
}

export default Media;