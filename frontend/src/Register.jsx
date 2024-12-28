import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await axios.post("/api/register", {username, email, password})
            alert(response.data.message)
            navigate('/login')
        }catch(error){
            console.log(error.response.data.message)
            alert(error.response.data.message)
        }
        

    }

    return (
        <>
        <form className='login-form' onSubmit={handleSubmit}>
            <h2>Username</h2>
            <input placeholder='username' type='text' value={username} onChange={(e) => setUsername(e.target.value)} required></input>
            <h2>Email</h2>
            <input placeholder='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required></input>
            <h2>Password</h2>
            <input placeholder='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button type='submit'>Register</button>
        </form>
        <a href='/login'>Register</a>
        </>
    )
}
export default Register;