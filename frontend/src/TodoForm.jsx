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
    const [name, setName] = useState("")
    const [todos, setTodos] = useState([])
    const [shrink, setShrink] = useState(false)
    const navigate = useNavigate()

    const date = new Date()
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const due_date = `${year}-${month}-${day}`
    
    const token = sessionStorage.getItem("token")
    if (!token){
        alert("You must be logged in to view your todos.");
        navigate("/login")
    }

    const fetch_todos = async () => {
        const response = await axios.get("http://localhost:5000/get_todos", {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json", 
            }
        })
        try{
            const todos = await response.data.todos
            setTodos(todos)
        }
        catch(error){
            alert(error)
            setTodos([])
        }
    }

    useEffect(()=>{
        fetch_todos()
    },[])
    

    const create_todo =  async (e, due_date) => {
        e.preventDefault()
        try{
            const response = await axios.post("http://localhost:5000/create_todo", {name, due_date},{
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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
                <label onClick={ ()=> setShrink(!shrink) } className="todo-filter-label">Today's tasks <FontAwesomeIcon icon={shrink ? faAngleUp: faAngleDown} /></label>
                <hr></hr>
                <div className={`todo-list-container ${shrink ? "shrink": ""}`}>
                    <TodoList  todos={todos} fetch_todos={fetch_todos} section={"Today"}/>
                </div>
            </div>
        </div>
    )
}