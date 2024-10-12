import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const UserContext = useContext()

export const UserProvider = ({children}) => {
    const [user, setUser] = useState({user: null, token: null})

    useEffect(()=>{
        const token = localStorage.getItem("token")
        if (token) {
            const decoded = jwt_decode(token)
            setUser({user:decoded, token:token})
        }
    },[])

    const login = async(email, password) => {
        try{
            const response = await axios.post("http://localhost:5000/login", {email,password})
            const token = response.data.access_token
            localStorage.setItem('token',token)
            const decoded = jwt_decode(token)
            setUser({user:decoded, token:token})
        } catch(error){
            alert(error.response.data.message)
        }
        
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser({user:null, token:null})
        alert("User logged out")
    }

    return (
        <UserContext.Provider value={{user,login,logout}}>
            {children}
        </UserContext.Provider>
    )
}