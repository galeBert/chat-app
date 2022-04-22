import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from "@apollo/client";
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import { usePlacesWidget } from 'react-google-autocomplete'

import { CREATE_ROOM, UPDATE_ROOM } from 'graphql/mutation';
import { GET_DETAIL_ROOM } from 'graphql/query';

import { storage } from 'utils/firebase'
import { uuidv4 } from 'utils/uuid';
import { uploadBytesResumable, ref as refStore, getDownloadURL } from "firebase/storage";

import './index.styles.css'
import { Redirect, useHistory } from 'react-router-dom';
import { useModal } from 'hooks/useModal';
import classNames from 'classnames';

const MAP_API_KEY = "AIzaSyCl0eTUbnDS4-kFW9-Xwb3Ih8KVuWRYeI4"
const libraries = ["places"]
const mapContainerStyle = {
  width: "100%",
  height: '100%'
}

const center = {
  lat: -6.914864,
  lng: 107.608238
};

const detail = {
  name: null,
  description: null,
  startDate: '',
  endDate: null,
  file: {
    url: null,
    file: null
  }
}

const AvaliableRoomForm = props => {

  const modal = useModal()
  const [radius, setRadius] = useState(10)
  const [required, setRequired] = useState(false)
  const [detailLoc, setDetail] = useState(detail)
  const [selectedLocation, setSelectedLocation] = useState(center)
  const history = useHistory()

  const roomId = props.match.params.id

  const [updateRoom, { loading: loadingEdit }] = useMutation(UPDATE_ROOM, {
    onCompleted: (res) => {
      modal.actions.onSetSnackbar('success update room')
      history.push("/available-room")
    }, onError: (err) => {
      modal.actions.onSetSnackbar(err.message)
    }
  })

  const [getDetailRoom, { data: dataRoom, loading: isLoadingRoom }] = useLazyQuery(GET_DETAIL_ROOM)
  const [createRoom, { data, loading }] = useMutation(CREATE_ROOM, {
    onCompleted: (res) => {

      // window.location.href = "/available-room"
      modal.actions.onSetSnackbar(res?.createRoom)
      history.push("/available-room")


    },
    onError: (err) => {
      modal.actions.onSetSnackbar(err.message)
    }
  })

  useEffect(() => {
    if (roomId) {
      getDetailRoom({ variables: { id: roomId } })
    }
  }, [roomId])

  const { ref } = usePlacesWidget({
    apiKey: MAP_API_KEY,
    onPlaceSelected: (place) => {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place?.formatted_address

      setSelectedLocation({ lat, lng, detail: { formattedAddress: address } })
    },
  })

  const handleRadiusMap = e => {
    const r = e.target.value
    if (r >= 10) setRadius(parseInt(r))
  }

  const handleChangeText = e => {
    setRequired(false)
    setDetail({
      ...detailLoc,
      [e.target.name]: e.target.value
    })
  }

  const handleUpload = e => {
    const file = e.target.files[0]
    const urlLocal = URL.createObjectURL(file)

    setDetail({ ...detailLoc, file: { url: urlLocal, file } })
  }

  const handleSubmit = () => {

    if ((detailLoc.startDate && detailLoc.endDate && detailLoc.name) === '') {
      modal.actions.onSetSnackbar("Required Field Can't be empty")
      if (dataRoom) {
        setRequired(false)
      } else {
        setRequired(true)
        return
      }

    }

    const { lat, lng, detail } = selectedLocation
    const defaultPayload = {
      roomName: detailLoc.name,
      tillDate: detailLoc.endDate,
      description: detailLoc.description,
      startingDate: detailLoc.startDate,
      location: { lat, lng, detail },
      range: radius
    }

    if (!detailLoc.file.file) {
      const payload = {
        variables: {
          ...defaultPayload,
          displayPicture: null,
        }
      }

      if (roomId) updateRoom({ variables: { ...payload.variables, roomId } })
      else createRoom(payload)

      return
    }
    const storageRef = refStore(storage, `room/${uuidv4()}`);
    const uploadAsset = uploadBytesResumable(storageRef, detailLoc.file.file);
    uploadAsset.on(
      'state_changed', (snap) => { }, // TODO: set progress and showing to UI
      err => console.error(err), // TODO: Need create snackbar for showing error uploaded file
      async () => {
        const assetUrl = await getDownloadURL(uploadAsset.snapshot.ref);

        // Display picture still mocking
        const { lat, lng, detail } = selectedLocation
        const payload = {
          variables: {
            ...defaultPayload,
            displayPicture: assetUrl
          }
        }

        if (roomId) updateRoom({ variables: { ...payload.variables, roomId } })
        else createRoom(payload)
        modal.actions.onSetSnackbar(`${detailLoc.name} has been created!`)
      }
    )
  }

  const classInputStyle = classNames(
    'bg-dark-300 h-12 rounded-md w-11/12 max-w-sm pl-2 border border-solid z-10'
  )

  return (
    <>
      <div className="grid grid-cols-2">
        <div className="w-full col-span-1 pl-5 pb-5 pr-5 pt-4 bg-dark-100 rounded-xl">
          <h1>{!roomId ? 'New' : 'Update'} Available Room</h1>
          <div className="grid grid-cols-2 grid-rows-3 mt-6 mb-6">
            <div className="mt-1 mb-1">
              <h6 className="mb-2 font-bold">Name</h6>
              <input
                name="name"
                onChange={handleChangeText}
                className={(required && !detailLoc.name) ? `${classInputStyle} border-red-600` : `${classInputStyle} border-gray-600`}
                placeholder="Orange" defaultValue={dataRoom?.getRoomById?.roomName || ''}
              />
            </div>

            <div className="mt-1 mb-1">
              <h6 className="mb-2 font-bold">Description</h6>
              <textarea
                name="description"
                onChange={handleChangeText}
                className="bg-dark-300 rounded-md w-11/12 h-20 max-w-sm pl-2 pt-1.5 border border-solid border-gray-600 z-10"
                placeholder="Search"
                defaultValue={dataRoom?.getRoomById?.description || ''}
              />
            </div>
            <div className="mt-1 mb-1">
              <h6 className="mb-2 font-bold">Location Available</h6>
              <input
                ref={ref}
                className={(required && !selectedLocation) ? `${classInputStyle} border-red-600` : `${classInputStyle} border-gray-600`}
                placeholder="Search"
                defaultValue={dataRoom?.getRoomById?.location?.detail?.formattedAddress || ''}
              />
            </div>

            <div className="mt-1 mb-1">
              <h6 className="mb-2 font-bold">Start Date</h6>
              <input
                type="date"
                name="startDate"
                onChange={handleChangeText}
                className={(required && !detailLoc.startDate) ? `${classInputStyle} border-red-600` : `${classInputStyle} border-gray-600`}
                defaultValue={dataRoom?.getRoomById?.startingDate || ''} />
            </div>
            <div className="mt-1 mb-1 row-span-3">
              <h6 className="mb-2 font-bold">Radius</h6>
              <input onChange={handleRadiusMap} type="number" className="bg-dark-300 h-12 rounded-md w-5/12 max-w-sm pl-2 border border-solid border-gray-600 z-10" placeholder="10 KM" defaultValue={dataRoom?.getRoomById?.location?.range || ''} />
            </div>

            <div className="mt-1 mb-1">
              <h6 className="mb-2 font-bold">End Date</h6>
              <input
                type="date"
                name="endDate"
                onChange={handleChangeText}
                className={(required && !detailLoc.endDate) ? `${classInputStyle} border-red-600` : `${classInputStyle} border-gray-600`}
                defaultValue={dataRoom?.getRoomById?.tillDate || ''} />
            </div>

            <div className="mt-4 mb-1">
              <h6 className="mb-2 font-bold">Upload</h6>
              <input onChange={handleUpload} type="file" style={{ paddingTop: 8 }} className="bg-dark-300 h-12 rounded-md w-11/12 max-w-sm pl-2 border border-solid border-gray-600 z-10" />
            </div>
          </div>
        </div>
        <div className='w-full col-span-1'>
          <LoadScript
            googleMapsApiKey={MAP_API_KEY}
            libraries={libraries}

          >
            <GoogleMap

              mapContainerStyle={mapContainerStyle}
              center={selectedLocation}
              options={{ streetView: false, streetViewControl: false, streetViewControlOptions: false, mapTypeControl: false }}
              zoom={14}
              onDragEnd={(i) => {
                console.log(i)
              }}
            >
              <Marker
                position={selectedLocation}
                icon={{
                  url: 'https://firebasestorage.googleapis.com/v0/b/insvire-curious-app12.appspot.com/o/mapRadius%2Fpin-figma.png?alt=media&token=3d842f6c-3338-486c-8605-4940e05b96b6',
                  scaledSize: !!window.google?.map && new window.google.maps.Size(15, 18)
                }} />
              <Circle
                center={selectedLocation}
                radius={radius * 100}
                options={{
                  fillColor: "#e8e2d8",
                  strokeColor: '#f6c059',
                  strokeWeight: 1
                }}
              />
              { /* Child components, such as markers, info windows, etc. */}
              <></>
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
      <div className='float-right mt-4 mb-4 flex' style={{ paddingBottom: 10 }}>
        <button onClick={() => history.push('/available-room')} className='w-40 text-center justify-center text-gray-100 hover:bg-dark-600 hover:bg-opacity-50 dark:text-gray-100 group flex items-center px-2 py-2 font-semibold rounded-md antialiased'>Cancel</button>
        <button onClick={handleSubmit} style={{ backgroundColor: '#7F57FF' }} className='w-40 text-center justify-center text-gray-100 hover:bg-dark-600 hover:bg-opacity-50 dark:text-gray-100 group flex items-center px-2 py-2 font-semibold rounded-md antialiased'>{loading ? "Creating..." : "Submit"}</button>
      </div>
    </>
  )
}

export default AvaliableRoomForm;
