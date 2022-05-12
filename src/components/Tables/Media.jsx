import { useState } from 'react';

import PostImageSlider from '../../components/PostImageSlider/PostImageSlider';

import { Gif, VideoOverlay } from '@giphy/react-components';
import { XIcon } from '@heroicons/react/outline';

const Media = ({ media, ...props }) => {
  const traslatedMedia = [];
  media?.content &&
    media?.content.map((data) => traslatedMedia.push(JSON.parse(data)));
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenGif, setIsOpenGif] = useState(false);
  let mediaRender;
  switch (media?.type) {
    case 'image':
      mediaRender = (
        <div className={`flex justify-center gap-${props.gap || 1}`}>
          {traslatedMedia &&
            traslatedMedia.map((data, key) => {
              return (
                <img
                  key={key}
                  alt='img_err'
                  className={` rounded object-cover`}
                  onClickCapture={() => setIsOpen(true)}
                  src={data?.secure_url}
                  style={{
                    width: `${props.width || 20}px`,
                    height: `${props.height || 20}px`,
                  }}
                />
              );
            })}
          <PostImageSlider
            data={traslatedMedia}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      );
      break;
    case 'gif':
      mediaRender = isOpenGif ? (
        <div className='absolute z-50 top-0 left-0 w-full h-full bg-dark-1/60 flex justify-center items-center'>
          <button
            className='w-10 h-10 absolute right-5 top-5'
            onClick={() => setIsOpenGif(false)}
          >
            <XIcon />
          </button>
          <div className=' w-96 h-72'>
            {traslatedMedia.map((data, key) => (
              <Gif
                key={key}
                className='cursor-pointer rounded-md'
                gif={data}
                height='100%'
                hideAttribution
                noLink
                overlay={data.type === 'video' ? VideoOverlay : null}
                width='100%'
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          {traslatedMedia.map((data, key) => (
            <Gif
              key={key}
              className='cursor-pointer rounded-md border border-gray-300 dark:border-dark-50'
              gif={data}
              height={props.height * 2 || 20}
              hideAttribution
              noLink
              onGifClick={() => {
                setIsOpenGif(true);
              }}
              overlay={data.type === 'video' ? VideoOverlay : null}
              width={props.width * 2 || 20}
            />
          ))}
        </div>
      );

      break;
    default:
      mediaRender = null;
  }

  return <div className='flex justify-center gap-1'>{mediaRender}</div>;
};

export default Media;
