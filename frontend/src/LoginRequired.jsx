import React, {useContext} from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from './UserContext'

const LoginRequired = ({children}) =>{
    const {user} = useContext(UserContext)

    if (!user.token){
        return <Navigate to='/login' replace/>
    }

    return children
}

export default LoginRequired;