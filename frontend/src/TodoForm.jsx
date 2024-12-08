import { useContext, useState } from "react"
import { UserContext } from "./UserContext"
import axios from 'axios';

export default function TodoForm(){
    const {user} = useContext(UserContext)
    const [name, setName] = useState("")

    const create_todo =  async (e) => {
        e.preventDefault()
        try{
            const response = await axios.post("http://localhost:5000/create_todo", {name},{
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            )
            const data = await response.data
            alert(data.message)
        }
        catch(error){
            alert(error)
        }
    }

    return(
        <div>
            <form className="todo-form" onSubmit={(e)=>create_todo(e)}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Todo Name"></input>
                <button type="submit">Create</button>
            </form>
            
        </div>
    )
}