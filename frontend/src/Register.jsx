import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faEye,
  faLock,
  faUser,
  faEyeSlash
} from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [showingPassword, setShowingPassword] = useState(false);
  
    const showPassword = () => {
      setShowingPassword(!showingPassword);
      const input = document.getElementById("password");
      if (input.type === "password"){
        input.type = "text";
      }
      else{
        input.type = "password";
      }
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/register", {
        username,
        email,
        password,
      });
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <p className="login-form-title">Register</p>
        <h4>Username</h4>
        <div>
          <FontAwesomeIcon className="input-icon" icon={faUser} />
          <input
            placeholder="Type your username here"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          ></input>
        </div>
          
        
        <h4>Email</h4>
        <div>
          <FontAwesomeIcon className="input-icon" icon={faAt} />
          <input
            placeholder="Type your email here"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
        </div>
        <h4>Password</h4>
        <div>
          <FontAwesomeIcon className="input-icon" icon={faLock} />
          <input
            id="password"
            placeholder="Type your password here"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <FontAwesomeIcon className="show-password-icon" icon={showingPassword ? faEyeSlash : faEye} onClick={() => showPassword()} />
        </div>
        <p className="login-to-register">Already have an account?: <a href="/login" className="register-link">Login here</a></p>
        <button className="login-btn" type="submit">Register</button>
      </form>

    </>
  );
};
export default Register;
