import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext()

export const UserProvider = ({children}) => {
    // Creates user variable
    const [user, setUser] = useState({user: null, token: null, username: null, sections: null, email:null})
    

    //useEffect(()=>{
        //If there is a token, store its value inside user variable
        //const token = sessionStorage.getItem("token")
        //if (token) {
           // try{
               // const decoded = jwtDecode(token)
              //  setUser({user:decoded, token:token, username:decoded.sub.username, sections:decoded.sub.sections})
          //  }catch (error){
              //  console.log(error)
              //  alert(error)
              //  sessionStorage.removeItem('token')
              //  logout()
          //  }
            
      //  }
   // },[])

    const login = async(email, password) => {
        try{
            const response = await axios.post("/api/login", {email,password},{
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            )
            const token = response.data.access_token
            sessionStorage.setItem('token',token)
            const decoded = jwtDecode(token)
            setUser({user:decoded, token:token, username:decoded.sub.username, sections:decoded.sub.sections, email:decoded.sub.sections})
        } catch(error){
            console.log(error.response.data.message)
            alert(error.response.data.message)
        }
        
    }

    const fetchUser = async () => {
        const token = sessionStorage.getItem("token")
        if (token){
            try {
            const response = await axios.get("/api/protected", {
                withCredentials: true,
                headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json", 
                },
            });
            if (response.data.user) {
                const data = response.data.user
                setUser({user:data, token:token, username:data.username, sections:data.sections, email:data.email})
            }
            } catch (error) {
            alert(error.response?.data?.message||"Session Expired");
            logout();
            navigate("/login");
            }
        }else{
            alert("Session expired")
            navigate('/login')
        }
    };
    

    const logout = async () => {
        sessionStorage.removeItem('token')
        setUser({user:null, token:null, username:null, sections:null, email:null})
        alert("User logged out!")
    }

    

    return (
        <UserContext.Provider value={{user,login,logout, fetchUser}}>
            {children}
        </UserContext.Provider>
    )
}