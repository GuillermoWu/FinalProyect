import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useContext(UserContext)
    const navigate = useNavigate()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(email,password)
        navigate('/account')
    }

    return (
      <form onSubmit={handleSubmit}>
        <h2>Email</h2>
        <input
          type="email"
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <h2>Password</h2>
        <input
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type='submit'>Login</button>
      </form>
    );
}

export default Login