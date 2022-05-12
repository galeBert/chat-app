import { Fragment } from 'react';

import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

const days = [
  { id: 1, value: '2', label: 'Co-Super Admin' },
  { id: 2, value: '3', label: 'Admin User' },
  { id: 3, value: '4', label: 'Admin Post' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SelectField({ callback, callbackValue }) {
  return (
    <Listbox onChange={callback} value={callbackValue}>
      <div className='my-3 relative'>
        <Listbox.Label className='block absolute top-1 left-3.5 text-sm font-medium text-typography-1 z-10'>
          Assigned to
        </Listbox.Label>
        <Listbox.Button className='relative w-full h-14 ring-1 ring-dark-1 rounded-md shadow-sm pl-3.5 pr-10 pt-4 text-left cursor-default focus:outline-none focus:ring-2 focus:ring-brand-1 sm:text-sm'>
          <span className='block truncate'>{callbackValue.label}</span>
          <span className='absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none'>
            <SelectorIcon aria-hidden='true' className='h-5 w-5 text-dark-1' />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options className='absolute z-20 mt-1 w-full bg-dark-1 shadow-xl max-h-80 rounded-md py-2 text-sm ring-1 ring-brand-1/95 overflow-auto focus:outline-none'>
            {days.map((person) => (
              <Listbox.Option
                key={person.id}
                className={({ active }) =>
                  classNames(
                    active
                      ? 'text-typography-1 bg-brand-1'
                      : 'text-typography-2',
                    'cursor-default select-none relative py-2 pl-3 pr-9'
                  )
                }
                value={person}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={classNames(
                        selected ? 'font-semibold' : 'font-normal',
                        'block truncate'
                      )}
                    >
                      {person.label}
                    </span>

                    {selected ? (
                      <span
                        className={classNames(
                          active ? 'text-typography-1' : 'text-brand-1',
                          'absolute inset-y-0 right-0 flex items-center pr-4'
                        )}
                      >
                        <CheckIcon aria-hidden='true' className='h-5 w-5' />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
