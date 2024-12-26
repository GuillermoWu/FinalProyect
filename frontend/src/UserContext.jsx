import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext()

export const UserProvider = ({children}) => {
    // Creates user variable
    const [user, setUser] = useState({user: null, token: null, username: null})
    

    useEffect(()=>{
        //If there is a token, store its value inside user variable
        const token = sessionStorage.getItem("token")
        if (token) {
            try{
                const decoded = jwtDecode(token)
                setUser({user:decoded, token:token, username:decoded.sub.username})
            }catch (error){
                console.log(error)
                alert(error)
                sessionStorage.removeItem('token')
            }
            
        }
    },[])

    const login = async(email, password) => {
        try{
            const response = await axios.post("http://localhost:5000/login", {email,password},{
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            )
            const token = response.data.access_token
            sessionStorage.setItem('token',token)
            const decoded = jwtDecode(token)
            setUser({user:decoded, token:token, username:decoded.sub.username})
        } catch(error){
            console.log(error.response.data.message)
            alert(error.response.data.message)
        }
        
    }

    const logout = async (e) => {
        e.preventDefault()
        sessionStorage.removeItem('token')
        setUser({user:null, token:null, username:null})
        alert("User logged out!")
    }

    return (
        <UserContext.Provider value={{user,login,logout}}>
            {children}
        </UserContext.Provider>
    )
}