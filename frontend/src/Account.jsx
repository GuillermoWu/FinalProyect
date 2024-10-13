import { useContext, useEffect, useState } from "react"
import { UserContext } from "./UserContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Account = () => {
    const { user , logout } = useContext(UserContext)
    const [currentUser, setCurrentUser] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchUser = async ()=>{
            try{
                const response = await axios.get("http://localhost:5000/protected", {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                
                })
                setCurrentUser(response.user);
            }catch(error){
                alert(error.response.message)
                logout()
                navigate('/login')
            }
        }
        fetchUser()
    },[user.token, logout, navigate])

    return (
      <>
        <h2>User info</h2>
        {currentUser ? (
            <div> 
                <h3>{currentUser.usesrname}</h3> 
                <h3>{currentUser.email}</h3>)
            </div>
        )
        : (<h3>Gathering user info</h3>)}
      </>
    );
}

export default Account