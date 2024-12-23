import { useContext, useEffect, useState } from "react"
import { UserContext } from "./UserContext"
import axios from 'axios';
import TodoList from "./TodoList";

export default function TodoForm(){
    const {user} = useContext(UserContext)
    const [name, setName] = useState("")
    const [todos, setTodos] = useState([])
    
    const token = sessionStorage.getItem("token")
    if (!token){
        alert("You must be logged in to view your todos.");
        return;
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
    

    const create_todo =  async (e) => {
        e.preventDefault()
        try{
            const response = await axios.post("http://localhost:5000/create_todo", {name},{
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            }
            )
            const data = await response.data
            alert(data.message)
            fetch_todos()
            setName("")
        }
        catch(error){
            alert(error.response?.data?.message || "An error occurred");
        }
    }

    return(
        <div className="todo-container">
            <form className="todo-form" onSubmit={(e)=>create_todo(e)}>
                <div className="input-container">
                    <input spellCheck="false" value={name} onChange={(e) => setName(e.target.value)} placeholder="Todo Name"></input>
                    <button type="submit">Create</button>
                </div>
            </form>
            <TodoList todos={todos} fetch_todos={fetch_todos}/>
        </div>
    )
}