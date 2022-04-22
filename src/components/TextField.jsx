import { useRef, useState } from "react";
import { useHistory } from "react-router";
import { useField } from "formik";
import classNames from "classnames";

import "./TextField.css";

import {
  EyeIcon,
  EyeOffIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/solid";

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
      className={classNames(
        "textfield-container",
        meta.touched ? (meta.error ? "invalid" : "") : ""
      )}
    >
      <input
        ref={input}
        className="textfield-input"
        placeholder=" "
        id={field.name}
        onKeyUp={
          props.name === "username" && path === "/register"
            ? () => setIsValidUsername(true)
            : null
        }
        {...field}
        {...props}
        type={visible === true ? "text" : props.type}
      />
      <label htmlFor={field.name} className="textfield-label">
        {label}
      </label>

      {/* {props.name === "username" && path === "/register" && (
        <button
          type="button"
          onClick={handleCheckUsername}
          className="absolute flex flex-row items-center right-3.5 top-3 p-1 px-3 rounded-md bg-yellow-300 text-gray-100 font-extrabold"
          disabled={loading}
        >
          {loading ? <Loader size="6" /> : "Check"}
        </button>
      )} */}

      {props.type === "password" && (
        <button
          type="button"
          onClick={handleClickVisible}
          className="absolute w-4 right-3.5 top-6"
        >
          {visible ? (
            <EyeIcon className="fill-current text-white w-4" />
          ) : (
            <EyeOffIcon className="fill-current text-white w-4" />
          )}
        </button>
      )}

      {meta.touched && meta.error ? (
        <label
          htmlFor={field.name}
          className="absolute flex flex-row items-center right-4 top-1 text-sm text-yellow-300 cursor-pointer"
        >
          {meta.error}
          <ExclamationCircleIcon className="w-3.5 ml-1" />
        </label>
      ) : null}
    </div>
  );
};

export default TextField;
