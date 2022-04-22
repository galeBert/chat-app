import React, { createContext, useState } from 'react'
import { Base64 } from 'js-base64';

export const UserContext = createContext({});

export default function UserProvider({ children }) {
    const adminPersist = localStorage.getItem('admin')
    const decodeDataAdmin = adminPersist ? JSON.parse(Base64.decode(adminPersist)) : ''
    const token = localStorage.getItem('token')
    const [userDetail, setUserDetail] = useState(decodeDataAdmin)

    const handleSetAdminLogin = admin => {
        setUserDetail(admin)
        const encodeData = Base64.encode(JSON.stringify(admin))
        localStorage.setItem('admin', encodeData)
    }

    const value = {
        value: {
            ...userDetail,
            token
        },
        actions: {
            onSetAdminLogin: handleSetAdminLogin
        }
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}
