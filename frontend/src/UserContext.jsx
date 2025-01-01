import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
 
  const [user, setUser] = useState({
    user: null,
    token: null,
    username: null,
    email: null,
  });

  //useEffect(()=>{
    //const token = sessionStorage.getItem('token')
    //if (token){
      //try{
       // const decoded = jwtDecode(token)
       // setUser({
         // user:decoded,
        //  token:token,
        //  username:decoded.sub.username,
        //  email:decoded.sub.email
     // })
     // }catch(error){
     //   alert(error)
    //    logout()
     //   sessionStorage.removeItem('token')
     // }
      
  //  }
 // },[])

  const fetchUser = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get("/api/protected", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.data.user) {
          const data = response.data.user;
          setUser({
            user: data,
            token: token,
            username: data.username,
            email: data.email,
          });
        }
      } catch (error) {
        logout();
        return
      }
    } else {
      logout();
      return
    }
  };

  const [currentSection, setCurrentSection] = useState([])
  const [todoSections, setTodoSections] = useState([])
  
  const fetchSections = async () => {
    try {
    const response = await axios.get('/api/get_sections', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
      setTodoSections(response.data.sections);
    } catch (error) {
      setTodoSections([]);
    }
  };

  const [todos, setTodos] = useState([])

  const fetchTodos = async () => {
    if (!sessionStorage.getItem("token")) {
      alert("Session expired");
      return
    }
    try {
    const response = await axios.get("/api/get_todos", {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
      setTodos(response.data.todos);
    } catch (error) {
      alert(error);
      setTodos([]);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "/api/login",
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const token = response.data.access_token;
      sessionStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser({
        user: decoded,
        token: token,
        username: decoded.sub.username,
        email: decoded.sub.email,
      });
      fetchSections()
    } catch (error) {
      alert(error.response.data.message);
    }
  };



  const logout = async () => {
    sessionStorage.removeItem("token");
    setUser({ user: null, token: null, username: null, email: null });
    alert("User logged out!");

  };

  const axiosRequest = async (url, method, data) => {
    try{
      await axios({
        url,
        method,
        data,
        withCredentials: true,
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
      })
      fetchTodos()
    }catch(error){
      alert(error);
    }
  }

  return (
    <UserContext.Provider value={{
       axiosRequest,
       user, 
       login, 
       logout, 
       fetchUser, 
       fetchSections, 
       fetchTodos, 
       currentSection, 
       setCurrentSection, 
       todoSections, 
       todos,
       }}
    >
      {children}
    </UserContext.Provider>
  );
};
