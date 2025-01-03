import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faEye,
  faEyeSlash,
  faLock
} from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(UserContext);
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
    await login(email, password);
    navigate("/account");
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <p className="login-form-title">Login</p>
      <h4>Email</h4>
      <div>
        <FontAwesomeIcon className="input-icon" icon={faAt} />
        <input
          type="email"
          value={email}
          placeholder="Type your email here"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div>     
      <h4>Password</h4>
      <div>
        <FontAwesomeIcon className="input-icon" icon={faLock} />
        <input
          type="password"
          id="password"
          value={password}
          placeholder="Type your password here"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <FontAwesomeIcon className="show-password-icon" icon={showingPassword ? faEyeSlash : faEye} onClick={() => showPassword()} />
      </div>
      <p className="login-to-register">Don't have an account yet?: <a href="/register" className="register-link">Register here</a></p>
      <button className="login-btn" type="submit">Login</button>
    </form>
  );
};

export default Login;
