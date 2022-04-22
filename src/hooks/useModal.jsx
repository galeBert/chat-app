import { ModalContext } from "context/ModalContext";
import { useContext } from "react";

export const useModal = () => useContext(ModalContext);
// export const useModal = () => {
//     const values = useContext(ModalContext);

//     return {
//         actions: values.actions,
//         ...values.value?.modal // isOpen, message
//     }
// }

// export const useSnackbar = () => {
//     const values = useContext(ModalContext);

//     return {
//         actions: values.actions,
//         ...values.value?.snackbar // isOpen, message
//     }
// }
