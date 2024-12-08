import { useEffect, useState } from "react"

export default function TodoList(){

    const [todos, setTodos] = useState({})

    useEffect(()=>{
        const get_todos = async() =>{
            const response = axios.get("http://localhost:5000/get_todos")
            try{
                const data = await response.data.todos
                setTodos(data)
            }
            catch(error){
                alert(error)
            }
        }
    },[])
    
    return(
        <div>
            <ul>
                {todos && todos.map(todo => 
                    <li>{todo.name}</li>
                )}
            </ul>
        </div>
    )
}