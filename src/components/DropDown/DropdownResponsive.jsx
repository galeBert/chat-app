import { useEffect, useRef, useState } from 'react';

import {
  CheckIcon,
  ChevronLeftIcon,
  DotsHorizontalIcon,
} from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

const Dropdown = ({ options = [], uniqueId, Icon, left }) => {
  const inputFrom = useRef();
  const inputTo = useRef();
  const wrapper = useRef(null);
  const refDropdown = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openChild, setOpenChild] = useState(false);
  const [dropDownkey, setDropDownkey] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideWrapper =
        wrapper.current && !wrapper.current.contains(event.target);
      const isInsideDropdown =
        refDropdown.current && !refDropdown.current.contains(event.target);

      if (isInsideWrapper && isInsideDropdown) {
        if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, wrapper]);

  useEffect(() => {
    if (!isOpen) setOpenChild(false);
  }, [isOpen]);
  // console.log("parent opening", isOpen, "childopening", openChild);

  const handleTimestamp = (event, setTimestamp, field) => {
    const value = event.target.value;
    setTimestamp((data) => {
      return { ...data, [field]: value };
    });
  };

  const handleSubmitTimestamp = (onClick, setTimestamp) => {
    onClick();
    setTimestamp(false);
    inputFrom.current.value = null;
    inputTo.current.value = null;
    setIsOpen(false);
  };
  return (
    <div className='relative w-full h-full flex justify-center items-center'>
      <div
        className='cursor-pointer'
        onClickCapture={() => setIsOpen(!isOpen)}
        ref={wrapper}
      >
        {Icon ? (
          <Icon className='w-5 h-5 m-auto' />
        ) : (
          <DotsHorizontalIcon className='w-5 h-5 m-auto' />
        )}
      </div>
      {options.length && (
        <div
          className='absolute flex justify-center top-12'
          ref={refDropdown}
          style={{ zIndex: isOpen ? 1 : -10 }}
        >
          <ul
            className={`w-40 text-center rounded-xl z-10 bg-dark-1 invisible border border-dark-9 border-solid ${
              left ? '-ml-24' : null
            } ${isOpen ? '!visible !inline ' : ''}`}
            style={{ opacity: isOpen ? 1 : 0 }}
          >
            {options.map(({ label, onClick, child, isActive, to }, key) => {
              const hasTimeStampInput =
                child && child.some((data) => data.hasTimeStampInput);
              return to ? (
                <li key={key} className='pb-1'>
                  <Link className='font-light' to={to}>
                    <span>{label}</span>
                  </Link>
                </li>
              ) : (
                <li
                  key={key}
                  className={`hover:cursor-pointer hover:bg-brand-1 hover:first: rounded-t-lg ${
                    uniqueId || 0
                  } relative ${isActive ? 'bg-brand-1' : ''}`}
                  onClickCapture={() => {
                    if (typeof onClick === 'function') {
                      onClick();
                      setIsOpen(!isOpen);
                    }
                    if (child && !hasTimeStampInput) {
                      setOpenChild((prev) => !prev);
                      setDropDownkey(label);
                    }
                    if (child && hasTimeStampInput) {
                      setOpenChild(true);
                      setDropDownkey(label);
                    }
                  }}
                >
                  {child && (
                    <button className='w-3 h-3 absolute left-1 top-4 bg-none'>
                      <ChevronLeftIcon />
                    </button>
                  )}
                  <span className='text-center'>{label}</span>
                  {isActive && (
                    <CheckIcon className='w-4 h-4 inline ml-1 absolute right-1' />
                  )}

                  {/* child container */}
                  {child && (
                    <ul
                      className={`absolute top-0 bg-dark-1 border border-solid border-dark-9 rounded-md w-44 -left-44 ${
                        openChild && label === dropDownkey ? 'block' : 'hidden'
                      }`}
                    >
                      {child.map(
                        (
                          {
                            label: childLabel,
                            onClick: childOnClick,
                            hasTimeStampInput: childHasTimeStampInput,
                            ...props
                          },
                          keys
                        ) => {
                          return (
                            <li
                              key={keys}
                              className={`${
                                childHasTimeStampInput
                                  ? 'm-2'
                                  : 'absolute top-0 bg-dark-1 border border-solid border-dark-9 rounded-md w-44'
                              } relative `}
                              onClickCapture={() => {
                                if (
                                  typeof childOnClick === 'function' &&
                                  !childHasTimeStampInput
                                ) {
                                  childOnClick();
                                  setIsOpen(!isOpen);
                                }
                              }}
                            >
                              {childLabel}
                              {childHasTimeStampInput && (
                                <div className='text-left'>
                                  <div>
                                    <span>From</span>
                                    <input
                                      className=' w-full bg-none text-typography-1 border border-solid border-dark-9 rounded-md p-1'
                                      onChange={(e) =>
                                        handleTimestamp(
                                          e,
                                          props.setTimestamp,
                                          'from'
                                        )
                                      }
                                      ref={inputFrom}
                                      type='date'
                                    />
                                  </div>
                                  <div>
                                    <span>To</span>
                                    <input
                                      className=' w-full bg-none text-typography-1 border border-solid border-dark-9 rounded-md p-1'
                                      onChange={(e) =>
                                        handleTimestamp(
                                          e,
                                          props.setTimestamp,
                                          'to'
                                        )
                                      }
                                      ref={inputTo}
                                      type='date'
                                    />
                                  </div>
                                  <div className='flex justify-end items-center'>
                                    <button
                                      className=' disabled:cursor-not-allowed disabled:bg-brand-1/60  bg-brand-1 pl-2 mt-3 pr-2 pt-1 pb-1 w-20 rounded-lg'
                                      disabled={
                                        !props.timestamp?.to ||
                                        !props.timestamp?.from
                                      }
                                      onClick={() =>
                                        handleSubmitTimestamp(
                                          props.setTimestamp,
                                          childOnClick
                                        )
                                      }
                                    >
                                      Search
                                    </button>
                                  </div>
                                </div>
                              )}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
