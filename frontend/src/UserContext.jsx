import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

export const UserContext = createContext()

export const UserProvider = ({children}) => {
    const [user, setUser] = useState({user: null, token: null})

    useEffect(()=>{
        const token = localStorage.getItem("token")
        if (token) {
            try{
                const decoded = jwtDecode(token)
                setUser({user:decoded, token:token})
            }catch (error){
                console.log(error)
                alert(error)
                localStorage.removeItem('token')
            }
            
        }
    },[])

    const login = async(email, password) => {
        try{
            const response = await axios.post("http://localhost:5000/login", {email,password})
            const token = response.data.access_token
            localStorage.setItem('token',token)
            const decoded = jwtDecode(token)
            setUser({user:decoded, token:token})
        } catch(error){
            console.log(error.response.data.message)
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