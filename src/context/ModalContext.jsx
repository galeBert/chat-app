import React, { createContext, useState } from 'react'
import { toast } from 'react-toastify';

export const ModalContext = createContext({});

export default function ModalProvider({ children }) {
  const [openModal, setOpenModal] = useState(false)
  const [isLoadingScreen, setIsLoadingScreen] = useState(false)

  const setSnackbar = (message) => toast(message);
  const onCloseSnackbar = () => setSnackbar(false, '');

  const value = {
    value: {
      isOpen: openModal,
      isLoadingScreen
    },
    actions: {
      onSetSnackbar: setSnackbar,
      onCloseSnackbar,
      setOpenModal,
      setIsLoadingScreen
    }
  }

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  )
}