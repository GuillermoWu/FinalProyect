import React from "react"
import { Navigate } from "react-router-dom"


const LoginRequired = ({children}) =>{
    const token = sessionStorage.getItem("token")

    if (!token){
        return <Navigate to="/login" replace/>
    }

    return children
}

export default LoginRequired;