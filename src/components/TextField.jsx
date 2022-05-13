import '../styles/globals.css';

import { useRef, useState } from 'react';

import clsxm from '../utils/clsxm';

import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeOffIcon,
} from '@heroicons/react/solid';
import { useField } from 'formik';
import { useHistory } from 'react-router-dom';

// import { CHECK_USERNAME } from 'graphql/mutations'

const TextField = ({
  label,
  autoFocus,
  setIsValidUsername,
  setUsernameErrorMassage,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  const [field, meta] = useField(props);

  const input = useRef();

  const path = useHistory().location.pathname;

  // const [check, { loading }] = useMutation(CHECK_USERNAME, {
  //     update(_, { data: { checkUsername } }) {
  //         setIsValidUsername(checkUsername)
  //         if (checkUsername) {
  //             setUsernameErrorMassage("Username is taken")
  //         } else if (!checkUsername) {
  //             setUsernameErrorMassage(null)
  //         }
  //     },
  //     onError(error) {
  //         console.log(error);
  //     }
  // })

  //   const handleCheckUsername = () => {
  //     check({ variables: { username: field.value } });
  //   };
  const handleClickVisible = () => {
    setVisible((prev) => !prev);
    input.current.focus();
  };

  return (
    <div
      className={clsxm(
        'textfield-container',
        meta.touched ? (meta.error ? 'invalid' : '') : ''
      )}
    >
      <input
        className='textfield-input'
        id={field.name}
        onKeyUp={
          props.name === 'username' && path === '/register'
            ? () => setIsValidUsername(true)
            : null
        }
        placeholder=' '
        ref={input}
        {...field}
        {...props}
        type={visible === true ? 'text' : props.type}
      />
      <label className='textfield-label' htmlFor={field.name}>
        {label}
      </label>

      {/* {props.name === "username" && path === "/register" && (
        <button
          type="button"
          onClick={handleCheckUsername}
          className="absolute flex flex-row items-center right-3.5 top-3 p-1 px-3 rounded-md bg-yellow-300 text-dark-9 font-extrabold"
          disabled={loading}
        >
          {loading ? <Loader size="6" /> : "Check"}
        </button>
      )} */}

      {props.type === 'password' && (
        <button
          className='absolute w-4 right-3.5 top-6'
          onClick={handleClickVisible}
          type='button'
        >
          {visible ? (
            <EyeIcon className='fill-current text-typography-1 w-4' />
          ) : (
            <EyeOffIcon className='fill-current text-typography-1 w-4' />
          )}
        </button>
      )}

      {meta.touched && meta.error ? (
        <label
          className='absolute flex flex-row items-center right-4 top-1 text-sm text-light-5 cursor-pointer'
          htmlFor={field.name}
        >
          {meta.error}
          <ExclamationCircleIcon className='w-3.5 ml-1' />
        </label>
      ) : null}
    </div>
  );
};

export default TextField;
