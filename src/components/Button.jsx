import React from 'react'
import classNames from 'classnames';

function Button({ children, className, type = "button", color = "primary", icon, onClick, disabled }) {
    let lightButton = (color === 'light') ? "border-gray-300" : "";
    console.log("lightButton", lightButton, color, "className", className);
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={classNames("flex flex-row w-full items-center justify-center mb-3 px-6 py-3 border border-transparent text-sm font-bold rounded-md shadow-sm text-white disabled:opacity-50 disabled:cursor-not-allowed", `${lightButton} bg-${color}-100 hover:bg-${color}-300 focus:bg-${color}-600`, className)}
        >
            {icon}
            {children}
        </button>
    )
}

export default Button