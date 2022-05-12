import { Fragment } from 'react';

import { useModal } from '../../hooks/useModal';

import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

export default function Modal({
  modalTitle,
  isModalOpen,
  setModalOpen,
  children,
  initialFocus,
  ...props
}) {
  // const cancelButtonRef = useRef(null)
  const modal = useModal();

  const handleClick = () => {
    props.onClick();
    setModalOpen(false);
  };
  return (
    <Transition.Root as={Fragment} show={isModalOpen}>
      <Dialog
        as='div'
        className='fixed z-50 inset-0 overflow-y-auto'
        initialFocus={initialFocus}
        onClose={() => setModalOpen(false)}
      >
        <div className='flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 border-dark-9/40 transition-opacity' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            aria-hidden='true'
            className='hidden sm:inline-block sm:align-middle sm:h-screen'
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div className='inline-block align-bottom overflow-visible shadow-md transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full'>
              <div className='bg-dark-1 p-3 rounded-xl'>
                <Dialog.Title className='flex flex-row justify-center py-2 border-b border-gray-300 text-lg mb-3 dark:border-dark-50'>
                  <span className='grow text-dark-9'>
                    {modalTitle || 'Modal'}
                  </span>
                  <button
                    className='w-6 absolute right-0 mr-2 rounded-md text-typography-2 hover:text-dark-1 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-1 dark:text-typography-3 dark:hover:text-dark-9'
                    onClick={() => modal.actions.setOpenModal(false)}
                    type='button'
                  >
                    <span className='sr-only'>Close</span>
                    <XIcon aria-hidden='true' className='h-6 w-6 text-dark-9' />
                  </button>
                </Dialog.Title>
                <div className='m-4'>{children}</div>
                {props.onClick && (
                  <div className='flex gap-1'>
                    <button className='p-2' onClick={() => setModalOpen(false)}>
                      Cancel
                    </button>
                    <button
                      className=' bg-brand-1 rounded-md p-2'
                      onClick={handleClick}
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
