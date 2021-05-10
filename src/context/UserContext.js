import React,{useState,createContext} from 'react'

export const UserContext = createContext()

export const UserProvider = (props)=>{
    const [sl,setSl] = useState(null)
    return (
        <UserContext.Provider value={[sl,setSl]}>
            {props.children}
        </UserContext.Provider>
    )
}