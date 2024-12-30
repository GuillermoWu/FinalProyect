import { useContext, useState } from "react"
import { UserContext } from "./UserContext"
import TodoList from "./TodoList";

export default function TodoSection(){
    const {todos, currentSection } = useContext(UserContext)

    return(
        <>
            {todos && 
            <div>
            <div className="todo-today-title">{currentSection.name}</div>
            {todos.filter((todo) => todo.section_id === currentSection.id).map(todo =>
                <TodoList key={todo.id} todo={todo}/>
            )}
            </div>
            }
            
        </>
    )
}