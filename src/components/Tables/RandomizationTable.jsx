import './style.css';

import { useEffect, useMemo, useRef, useState } from 'react';

import UploadIcon from '../../assets/imageDefault.svg';
import ColorPicker from '../../components/ColorPicker';
import { DELETE_ITEM_THEME, UPDATE_THEMES } from '../../graphql/mutation';
import clsxm from '../../utils/clsxm';
import { storage } from '../../utils/firebase';

import { useMutation } from '@apollo/client';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const RandomizationTable = ({ data, title, onRefetch, ...props }) => {
  const TextInput = useRef();
  const wrapper = useRef();
  const history = useHistory();
  const pathname = history.location.pathname;

  //change path space to underscore
  const path = useMemo(() => {
    let paths = pathname.split('/')[2];
    let i = 0;
    for (i; i < paths.length; i++) {
      paths = paths.replace(' ', '_');
    }

    return paths;
  }, [pathname]);

  //end
  const tableHead = ['Name', 'Action'];
  const [previewImg, setPreviewImg] = useState(null); // handle for preview image when user uploaded
  const [imgFile, setImgFile] = useState(null);
  const [isCompleteUpdate, setIsCompleteUpdate] = useState(false);
  const [hexCode, setHexCode] = useState('#fff');
  const [isNewHex, setIsNewHex] = useState(false);
  const [input, setInput] = useState('');
  const [newInput, setNewInput] = useState(false);
  const [progress, setProgress] = useState(0);
  const [switchButton, setSwitchButton] = useState(null);
  console.log(progress);
  const [deleteConfigThemeById] = useMutation(DELETE_ITEM_THEME, {
    onCompleted() {
      if (typeof onRefetch === 'function') onRefetch();
      setIsCompleteUpdate(true);
    },
  });
  const [updateThemes, { loading }] = useMutation(UPDATE_THEMES, {
    onCompleted() {
      if (typeof onRefetch === 'function') onRefetch();
      setIsCompleteUpdate(true);
    },
    // update(cache, { data: { updateThemesById }, loading }) {
    //   const test = cache.readQuery({ query: GET_THEMES, variables:{name: path} })
    //   console.log(test);
    //   return {
    //     ...theme,
    //     isActive: updateThemesById.isActive,
    //     isDeleted: updateThemesById.isDeleted
    //   }
    // }

    //   cache.writeQuery({
    //     query: GET_THEMES,
    //     data: {
    //       searchThemes: newThemeData
    //     }
    //   })
    // }
  });

  useEffect(() => {
    const handleOnBlur = (event) => {
      const isOutsideWrapper =
        wrapper?.current && !wrapper?.current.contains(event.target);

      if (isOutsideWrapper || (isOutsideWrapper && isCompleteUpdate)) {
        setSwitchButton(null);
      }
    };

    document.addEventListener('mousedown', handleOnBlur);

    return () => {
      document.removeEventListener('mousedown', handleOnBlur);
    };
  }, [wrapper, switchButton, isCompleteUpdate]);

  const callbackPickeronChange = (item, prevHex, id) => {
    if (!prevHex) setHexCode(item.hex);
    else if (prevHex) setIsNewHex({ hex: item.hex, id });
  };
  const handleUpload = (e) => {
    setIsCompleteUpdate(false);
    const file = e.target.files[0];
    const urlLocal = URL.createObjectURL(file);
    setPreviewImg(urlLocal);
    setImgFile(file);
    TextInput.current.value = file.name.split('.')[0];
    setInput(file.name.split('.')[0]);
  };

  const handleSubmitForm = (item, id, newHex, newAvatarUrl, prevInput) => {
    const defaultItemPayload = {
      name: newInput ? newInput : prevInput || input,
      id: id ? id : uuidv4(),
    };

    if (item === 'Colors') {
      updateThemes({
        variables: {
          id: props.id,
          colors: [
            {
              ...defaultItemPayload,
              hex: newHex ? newHex : hexCode,
            },
          ],
        },
      });

      setHexCode('#fff');
      setSwitchButton(null);
      setIsNewHex(null);
      setNewInput(null);
    }
    if (item === 'Adjective') {
      updateThemes({
        variables: {
          id: props.id,
          adjective: [defaultItemPayload],
        },
      });
      setSwitchButton(null);
    }
    if (item === 'Nouns') {
      if (imgFile) {
        const refs = ref(storage, `avatars/${path}/${input}`);
        const uploadTask = uploadBytesResumable(refs, imgFile);

        return uploadTask.on(
          'state_changed',
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(percent);
          },
          (err) => console.log('err', err),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              updateThemes({
                variables: {
                  id: props.id,
                  nouns: [
                    {
                      ...defaultItemPayload,
                      avatarUrl: url,
                    },
                  ],
                },
              });
              setPreviewImg(null);
              setImgFile(null);
              TextInput.current.value = null;
            });
          }
        );
      }

      updateThemes({
        variables: {
          id: props.id,
          nouns: [
            {
              ...defaultItemPayload,
            },
          ],
        },
      });
      TextInput.current.value = null;
      setSwitchButton(null);
    }
    TextInput.current.value = null;
    return setInput('');
  };

  const handleChange = (e, prevValue) => {
    if (!prevValue) setInput(e.target.value);
    else if (prevValue) setNewInput(e.target.value);

    setIsCompleteUpdate(false);
  };
  const handleRemoveConfig = (id) => () => {
    deleteConfigThemeById({
      variables: {
        attr: title.toLowerCase(),
        id,
        themeId: props.id,
      },
    });
  };

  const classInputStyle = clsxm(
    'test w-7 h-7 rounded-sm absolute -top-11 left-4',
    { 'bg-transparent': !previewImg }
  );

  const classNameImg = useMemo(
    () => ({
      ...(previewImg
        ? { backgroundImage: `url(${previewImg || ''})` }
        : { backgroundImage: `url(${UploadIcon})` }),
      backgroundSize: 'contain',
    }),
    [previewImg]
  );

  const handleFocus = (e) => {
    setSwitchButton(e.target.id);
  };

  const skeletonLoop = [1, 2, 3, 4, 5];
  return (
    <div>
      <div className='relative'>
        <input
          className={`table-input-skin p-2 max-w-md  ${
            title !== 'Adjective' && 'pl-10'
          }`}
          id='name'
          name='name'
          onChange={handleChange}
          ref={TextInput}
        />
        <button
          className='text-white absolute right-7 w-16 top-4 bg-dark-300 '
          disabled={title === 'Nouns' && !previewImg && loading}
          onClick={() => handleSubmitForm(title)}
          type='submit'
        >
          {loading ? (
            <div className=' w-full h-6 flex justify-center items-center'>
              <div className='loading w-4 h-4' />
            </div>
          ) : (
            'add new'
          )}
        </button>

        {title === 'Nouns' && (
          <div className='relative'>
            <div className={classInputStyle} style={classNameImg} />
            <input
              accept='image/*'
              className='absolute -top-11 left-4 opacity-0'
              id='myFile'
              name='filename'
              onChange={handleUpload}
              placeholder=' '
              style={{ width: 30, height: 30 }}
              type='file'
            />
          </div>
        )}
        {title === 'Colors' && (
          <div className='relative'>
            <div
              className='test w-7 h-7 rounded-md absolute -top-11 left-4'
              style={{ backgroundColor: `${hexCode}` }}
            />

            <div className='absolute testnyaa -top-11 left-4 z-10'>
              <ColorPicker onChange={callbackPickeronChange} />
            </div>
          </div>
        )}
      </div>
      <table className='table-responsive w-full overflow-scroll h-4'>
        <thead>
          <tr>
            {tableHead.map((label, key) => (
              <th key={key} className={`p-1.5 ${label === 'Action' && ' w-8'}`}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.isLoading &&
            skeletonLoop.map((_, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    <div className='skeleton w-80 h-8 m-2' />
                  </td>
                  <td>
                    <button className='w-5 h-5'>
                      <XIcon />
                    </button>
                  </td>
                </tr>
              );
            })}
          {data && data.length
            ? data.map((datas, idx) => {
                return (
                  <tr key={idx} ref={wrapper}>
                    <td className='border-transparent'>
                      <div className='relative'>
                        <input
                          key={datas.id}
                          className={`table-input-skin p-2 max-w-sm ${
                            (datas?.avatarUrl || datas?.hex) && 'pl-11'
                          }`}
                          defaultValue={datas?.name}
                          id={datas.id}
                          onChange={(e) => handleChange(e, datas?.name)}
                          onFocus={handleFocus}
                        />
                        {datas?.avatarUrl && (
                          <img
                            alt='img_broken'
                            className='text-white absolute left-4 w-7 h-7 rounded-md top-4'
                            src={datas?.avatarUrl}
                          />
                        )}
                        {datas?.hex && (
                          <div className='relative'>
                            <div
                              className='test w-7 h-7 rounded-md absolute -top-11 bg-primary-100 left-4'
                              style={{
                                backgroundColor: `${
                                  isNewHex?.hex && isNewHex.id === datas.id
                                    ? isNewHex.hex
                                    : datas.hex
                                }`,
                              }}
                            />

                            <div className='absolute testnyaa -top-11 left-4 z-10'>
                              <ColorPicker
                                onChange={(e) =>
                                  callbackPickeronChange(e, datas.hex, datas.id)
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td
                      className='text-center flex justify-center items-center h-full border-transparent'
                      id={datas.id}
                    >
                      {switchButton === datas.id ? (
                        <button
                          className='w-5 h-5'
                          onClick={() =>
                            handleSubmitForm(
                              title,
                              datas.id,
                              isNewHex?.hex ? isNewHex.hex : datas.hex,
                              null,
                              datas.name
                            )
                          }
                        >
                          <CheckIcon />
                        </button>
                      ) : (
                        <button
                          className='w-5 h-5'
                          onClick={handleRemoveConfig(datas.id)}
                        >
                          <XIcon />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );
};

export default RandomizationTable;
