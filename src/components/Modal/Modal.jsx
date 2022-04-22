import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { useModal } from 'hooks/useModal'


export default function Modal({ modalTitle, isModalOpen, setModalOpen, children, initialFocus, ...props }) {
    // const cancelButtonRef = useRef(null)
    const modal = useModal()

    const handleClick = () => {
        props.onClick()
        setModalOpen(false)
    }
    return (
        <Transition.Root show={isModalOpen} as={Fragment}>
            <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" initialFocus={initialFocus} onClose={() => setModalOpen(false)}>
                <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-300 bg-opacity-40 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom overflow-visible shadow-md transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <div className="bg-dark-100 p-3 rounded-xl">
                                <Dialog.Title className="flex flex-row justify-center py-2 border-b border-gray-300 text-lg mb-3 dark:border-dark-50">
                                    <span className="flex-grow text-gray-100">{modalTitle || 'Modal'}</span>
                                    <button
                                        type="button"
                                        className="w-6 absolute right-0 mr-2 rounded-md text-gray-600 hover:text-dark-100 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-100 dark:text-gray-300 dark:hover:text-gray-100"
                                        onClick={() => modal.actions.setOpenModal(false)}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XIcon className="h-6 w-6 text-gray-100" aria-hidden="true" />
                                    </button>
                                </Dialog.Title>
                                <div className="m-4">
                                    {children}
                                </div>
                                {props.onClick && (
                                    <div className='flex gap-1'>
                                        <button onClick={() => setModalOpen(false)} className='p-2'>Cancel</button>
                                        <button onClick={handleClick} className=' bg-primary-100 rounded-md p-2'>Confirm</button>
                                    </div>
                                )}

                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}