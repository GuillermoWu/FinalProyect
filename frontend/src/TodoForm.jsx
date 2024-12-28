import { useContext, useEffect, useState } from "react"
import { UserContext } from "./UserContext"
import axios from 'axios';
import TodoList from "./TodoList";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faAngleUp,
  } from "@fortawesome/free-solid-svg-icons";
  import { useNavigate } from "react-router-dom";



export default function TodoForm(){
    const {user, logout, fetchUser} = useContext(UserContext)
    const [currentUser, setCurrentUser] = useState({})
    const [name, setName] = useState("")
    const [todos, setTodos] = useState([])
    const [shrink, setShrink] = useState({
        today: false,
        overdue: false,
        upcoming: false
    })
    const navigate = useNavigate()

    const date = new Date()
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const due_date = `${year}-${month}-${day}`
    
    useEffect(() => {
        fetchUser()
        const token = sessionStorage.getItem("token");
        if (!token) {
          alert("You must be logged in to view your todos.");
          navigate("/login");
        }
    }, []);

    const fetch_todos = async () => {
        if (!sessionStorage.getItem("token")){
            alert("Session expired")
        }
        const response = await axios.get("/api/get_todos", {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "Content-Type": "application/json", 
            }
        })
        try{
            const todos = await response.data.todos
            setTodos(todos)
        }
        catch(error){
            const data = await response.data
            alert(data.message)
            setTodos([])
        }
    }

    useEffect(()=>{
        fetch_todos()
    },[])
    

    const create_todo =  async (e, due_date) => {
        e.preventDefault()
        try{
            await axios.post("/api/create_todo", {name, due_date},{
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem("token")}`    
                }
            }
            )
            fetch_todos()
            setName("")
        }
        catch(error){
            alert(error);
        }
    }

    return(
        <div className="todo-container">
            <div className="todo-today-title">Today</div>
            <div className="todo-today-content">
                <form className="todo-form" onSubmit={(e)=>create_todo(e, due_date)}>
                    <div className="input-container">
                        <input spellCheck="false" value={name} onChange={(e) => setName(e.target.value)} placeholder="Todo Name"></input>
                        <button type="submit">Create</button>
                    </div>
                </form>
                
                <div className="overdue-tasks">
                    <label onClick={ ()=> setShrink((prevState)=>({...prevState,overdue:!shrink.overdue}))} className="todo-filter-label">Overdue tasks <FontAwesomeIcon className="dropdown-icon" icon={shrink.overdue ? faAngleUp: faAngleDown} /></label>
                    <hr></hr>
                    <div className={`todo-list-container ${shrink.overdue ? "shrink": ""}`}>
                        <TodoList  todos={todos} fetch_todos={fetch_todos} section={"Overdue"}/>
                    </div>
                </div>
                
                <div className="today-tasks">
                    <label onClick={ ()=> setShrink((prevState)=>({...prevState,today:!shrink.today}))} className="todo-filter-label">Today's tasks <FontAwesomeIcon className="dropdown-icon" icon={shrink.today ? faAngleUp: faAngleDown} /></label>
                    <hr></hr>
                    <div className={`todo-list-container ${shrink.today ? "shrink": ""}`}>
                        <TodoList  todos={todos} fetch_todos={fetch_todos} section={"Today"}/>
                    </div>
                </div>

                <div className="today-tasks">
                    <label onClick={ ()=> setShrink((prevState)=>({...prevState,upcoming:!shrink.upcoming}))} className="todo-filter-label">Upcoming tasks <FontAwesomeIcon className="dropdown-icon" icon={shrink.upcoming ? faAngleUp: faAngleDown} /></label>
                    <hr></hr>
                    <div className={`todo-list-container ${shrink.upcoming ? "shrink": ""}`}>
                        <TodoList  todos={todos} fetch_todos={fetch_todos} section={"Upcoming"}/>
                    </div>
                </div>
                
            </div>
        </div>
    )
}