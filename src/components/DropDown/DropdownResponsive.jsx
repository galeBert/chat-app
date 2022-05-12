import './index.css';

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
    <div className='d-action text-center'>
      <div
        className='three-dots'
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
          className='dropdown'
          ref={refDropdown}
          style={{ zIndex: isOpen ? 1 : -10 }}
        >
          <ul
            className={`wrapper ${left ? '-ml-24' : null} ${
              isOpen ? 'dropdown-active' : ''
            }`}
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
                  className={`dropdown-item ${uniqueId || 0} relative ${
                    isActive ? 'bg-primary-100' : ''
                  }`}
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
                    <button className='w-3 h-3 absolute left-1 top-4 bg-transparent'>
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
                      className={`dropdown-child ${
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
                                  ? 'dropdown-item-child'
                                  : 'dropdown-item'
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
                                      className=' w-full bg-transparent text-white border border-solid border-gray-600 rounded-md p-1'
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
                                      className=' w-full bg-transparent text-white border border-solid border-gray-600 rounded-md p-1'
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
                                      className=' disabled:cursor-not-allowed disabled:bg-primary-100/60  bg-primary-100 pl-2 mt-3 pr-2 pt-1 pb-1 w-20 rounded-lg'
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
