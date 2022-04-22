import { useHistory } from "react-router-dom";
import { useState, useRef, useMemo, useEffect } from "react";
import cn from 'classnames';
import { useMutation } from "@apollo/client";
import { v4 as uuidv4 } from 'uuid';

import ColorPicker from "components/ColorPicker";
import { storage } from "utils/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import UploadIcon from 'assets/imageDefault.svg'

import { UPDATE_THEMES, DELETE_ITEM_THEME } from "graphql/mutation";

import './style.css'
import { CheckIcon, XIcon } from "@heroicons/react/outline";

const RandomizationTable = ({ data, title, onRefetch, ...props }) => {
    const TextInput = useRef()
    const wrapper = useRef();
    const history = useHistory()
    const pathname = history.location.pathname;

    //change path space to underscore
    const path = useMemo(
        () => {
            let path = pathname.split('/')[2]
            var i = 0, pathLength = path.length;
            for (i; i < pathLength; i++) {
                path = path.replace(" ", "_");
            }

            return path;
        },
        [pathname]
    )

    //end
    const tableHead = ["Name", "Action"]
    const [previewImg, setPreviewImg] = useState(null) // handle for preview image when user uploaded
    const [imgFile, setImgFile] = useState(null)
    const [isCompleteUpdate, setIsCompleteUpdate] = useState(false);
    const [hexCode, setHexCode] = useState('#fff')
    const [isNewHex, setIsNewHex] = useState(false)
    const [input, setInput] = useState('')
    const [newInput, setNewInput] = useState(false)
    const [progress, setProgress] = useState(0)
    const [switchButton, setSwitchButton] = useState(null)


    const [deleteConfigThemeById, { loading: loadingRemove }] = useMutation(DELETE_ITEM_THEME, {
        onCompleted() {
            if (typeof onRefetch === 'function') onRefetch()
            setIsCompleteUpdate(true);
        }
    });
    const [updateThemes, { loading }] = useMutation(UPDATE_THEMES, {
        onCompleted() {
            if (typeof onRefetch === 'function') onRefetch()
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
    })

    useEffect(() => {
        const handleOnBlur = event => {
            const isOutsideWrapper = wrapper?.current && !wrapper?.current.contains(event.target);

            if (isOutsideWrapper || (isOutsideWrapper && isCompleteUpdate)) {
                setSwitchButton(null);
            }
        }

        document.addEventListener('mousedown', handleOnBlur);

        return () => {
            document.removeEventListener('mousedown', handleOnBlur);
        }

    }, [wrapper, switchButton, isCompleteUpdate])

    const callbackPickeronChange = (item, prevHex, id) => {
        if (!prevHex) setHexCode(item.hex)
        else setIsNewHex({ hex: item.hex, id: id })
    }
    const handleUpload = (e) => {
        setIsCompleteUpdate(false);
        const file = e.target.files[0]
        const urlLocal = URL.createObjectURL(file)
        setPreviewImg(urlLocal)
        setImgFile(file)
        TextInput.current.value = file.name.split('.')[0]
        setInput(file.name.split('.')[0])

    }

    const handleSubmitForm = (item, id, newHex, newAvatarUrl, prevInput) => {
        const defaultItemPayload = {
            name: newInput ? newInput : (prevInput || input),
            id: id ? id : uuidv4()
        };

        if (item === 'Colors') {
            updateThemes({
                variables: {
                    id: props.id,
                    colors: [
                        {
                            ...defaultItemPayload,
                            hex: newHex ? newHex : hexCode,
                        }
                    ]
                }
            });

            setHexCode('#fff')
            setSwitchButton(null)
            setIsNewHex(null)
            setNewInput(null)
        }
        if (item === 'Adjective') {
            updateThemes({
                variables: {
                    id: props.id,
                    adjective: [defaultItemPayload]
                }
            });
            setSwitchButton(null)
        }
        if (item === 'Nouns') {
            if (imgFile) {
                const refs = ref(storage, `avatars/${path}/${input}`);
                const uploadTask = uploadBytesResumable(refs, imgFile);
                
                return uploadTask.on("state_changed", (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(progress)
                }, (err) => console.log("err", err),
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then(url => {
                                updateThemes({
                                    variables: {
                                        id: props.id,
                                        nouns: [{
                                            ...defaultItemPayload,
                                            avatarUrl: url
                                        }]
                                    }
                                });
                                setPreviewImg(null)
                                setImgFile(null)
                                TextInput.current.value = null
                            })
                    }
                )
            }

            updateThemes({
                variables: {
                    id: props.id,
                    nouns: [{
                        ...defaultItemPayload
                    }]
                }
            });
            TextInput.current.value = null
            setSwitchButton(null)
        }
        TextInput.current.value = null
        setInput('')
    }

    const handleChange = (e, prevValue) => {
        if (!prevValue) setInput(e.target.value)
        else setNewInput(e.target.value)

        setIsCompleteUpdate(false)
    }
    const handleRemoveConfig = id => () => {
        deleteConfigThemeById({
            variables: {
                attr: title.toLowerCase(),
                id,
                themeId: props.id
            }
        })
    }

    const classInputStyle = cn(
        'test w-7 h-7 rounded-sm absolute -top-11 left-4',
        { 'bg-transparent': !previewImg }
    )

    const classNameImg = useMemo(
        () => ({
            ...(previewImg ? { backgroundImage: `url(${previewImg || ''})` } : { backgroundImage: `url(${UploadIcon})` }),
            backgroundSize: 'contain'
        }),
        [previewImg, UploadIcon]
    )

    const handleFocus = (e) => {
        setSwitchButton(e.target.id)
    }

    const skeletonLoop = [1, 2, 3, 4, 5]
    return (
        <div>
            <div className="relative">
                <input onChange={handleChange} ref={TextInput} name="name" id="name" className={`table-input-skin p-2 max-w-md  ${title !== 'Adjective' && 'pl-10'}`} />
                <button onClick={() => handleSubmitForm(title)} disabled={(title === 'Nouns' && !previewImg) && loading} type="submit" className="text-white absolute right-7 w-16 top-4 bg-dark-300 ">{loading ? <div className=" w-full h-6 flex justify-center items-center"><div className="loading w-4 h-4" /></div> : 'add new'}</button>

                {title === 'Nouns' && (
                    <div className="relative">
                        <div style={classNameImg} className={classInputStyle} />
                        <input onChange={handleUpload} className="absolute -top-11 left-4 opacity-0" style={{ width: 30, height: 30 }} type="file" id="myFile" placeholder=" " accept="image/*" name="filename" />
                    </div>
                )}
                {title === 'Colors' && (
                    <div className="relative">
                        <div style={{ backgroundColor: `${hexCode}` }} className="test w-7 h-7 rounded-md absolute -top-11 left-4" />

                        <div className="absolute testnyaa -top-11 left-4 z-10">
                            <ColorPicker onChange={callbackPickeronChange} />
                        </div>

                    </div>
                )}
            </div>
            <table className="table-responsive w-full overflow-scroll h-4">
                <thead>
                    <tr>
                        {tableHead.map(label => (
                            <th className={`p-1.5 ${label === "Action" && ' w-8'}`}>{label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.isLoading && skeletonLoop.map(() => {
                        return (
                            <tr>
                                <td>
                                    <div className="skeleton w-80 h-8 m-2" />
                                </td>
                                <td>
                                    <button className="w-5 h-5"><XIcon /></button>
                                </td>
                            </tr>)
                    })}
                    {(data && data.length) ? data.map((data, idx) => {
                        return (
                            <tr key={idx} ref={wrapper}>
                                <td className="border-transparent">

                                    <div className="relative">
                                        <input
                                            onChange={(e) => handleChange(e, data?.name)}
                                            onFocus={handleFocus}
                                            key={data.id}
                                            id={data.id}
                                            className={`table-input-skin p-2 max-w-sm ${(data?.avatarUrl || data?.hex) && 'pl-11'}`}
                                            defaultValue={data?.name}
                                        />
                                        {data?.avatarUrl && (
                                            <img src={data?.avatarUrl} className="text-white absolute left-4 w-7 h-7 rounded-md top-4" alt="image broken" />
                                        )}
                                        {data?.hex && (
                                            <div className="relative">
                                                <div style={{ backgroundColor: `${isNewHex?.hex && (isNewHex.id === data.id) ? isNewHex.hex : data.hex}` }} className="test w-7 h-7 rounded-md absolute -top-11 bg-primary-100 left-4" />

                                                <div className="absolute testnyaa -top-11 left-4 z-10">
                                                    <ColorPicker onChange={(e) => callbackPickeronChange(e, data.hex, data.id)} />
                                                </div>

                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td
                                    id={data.id}
                                    className="text-center flex justify-center items-center h-full border-transparent">
                                    {switchButton === data.id ? (
                                        <button className="w-5 h-5" onClick={() => handleSubmitForm(title, data.id, isNewHex?.hex ? isNewHex.hex : data.hex, null, data.name)}><CheckIcon /></button>
                                    ) : (
                                        <button className="w-5 h-5" onClick={handleRemoveConfig(data.id)}><XIcon /></button>
                                    )}
                                </td>
                            </tr>
                        )
                    }) : null}
                </tbody>
            </table>
        </div>

    );
}

export default RandomizationTable;
