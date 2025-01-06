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
        return "session-expired"
      }
    } else {
      logout()
      return "session-expired"
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
      return "session-expired"
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
        return
    }
  };



  const logout = async () => {
    sessionStorage.removeItem("token");
    setUser({ user: null, token: null, username: null, email: null });

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
      
    }catch(error){
      return
    }
  }
  
  const location = window.location.href;
  const [todoItem, setTodoItem] = useState({
    updating: false,
    current: "",
    currentDueDate: "",
    section: location.slice(40, location.length),
    priorityUpdating: { id: null, state: false },
    priorityLabelUpdating: {
      id: null,
      state: false,
      name: null,
      priority: null,
    },
  }); 

  const [creating, setCreating] = useState(false);

  const create_todo = async (e, name, due_date, section) => {
      e.preventDefault();
      try {
        await axios.post(
          "/api/create_todo",
          { name, due_date, section },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        fetchTodos();
        setCreating(!creating)
      } catch (error) {
       return
      }
    };

  const creating_label = () => {
    return (
      <form onSubmit={(e) =>
        create_todo(
          e,
          todoItem.current,
          todoItem.currentDueDate,
          todoItem.section
        )
      } 
      className="updating-todo-label">
        <input
          required
          value={todoItem.current}
          onChange={(e) =>
            setTodoItem((prevState) => ({
              ...prevState,
              current: e.target.value,
            }))
          }
          className="updating-todo-input"
        ></input>

        <label className="todo-description-label">Description</label>

        <div className="description-btns-container">
          <div className="description-btns-content">
            <input
              type="date"
              value={todoItem.currentDueDate ? todoItem.currentDueDate : setTodoItem((prevState) => ({...prevState, currentDueDate: today_date}))}
              onChange={(e) =>
                setTodoItem((prevState) => ({
                  ...prevState,
                  currentDueDate: e.target.value,
                }))
              }
              className="description-btn-date"
            ></input>
          </div>


          <div className="description-btns-content">
            <select
              name="section"
              className="description-btn-section"
              onChange={(e) =>
                setTodoItem((prevState) => ({
                  ...prevState,
                  section: e.target.value,
                }))
              }
            >
              <option value={location.slice(40, location.length)}>{location.slice(40, location.length)}</option>
              {todoSections &&
                todoSections.filter(todoSection => todoSection.name !== location.slice(40, location.length)).map((todoSection) => (
                  <option key={todoSection.id} value={todoSection.name}>
                    {todoSection.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="updating-label-btns">
          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              setCreating(!creating)
            }
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
          >
            Create
          </button>
        </div>
      </form>

    )
  }

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const today_date = `${year}-${month >= 10 ?  month : `0${month}`}-${day >= 10 ?  day : `0${day}`}`;

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
       create_todo,
       todoItem,
       setTodoItem,
       today_date,
       today,
       location,
       creating_label,
       creating,
       setCreating
       }}
    >
      {children}
    </UserContext.Provider>
  );
};
