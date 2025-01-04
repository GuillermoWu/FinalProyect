import { useContext, useEffect, useRef } from "react";
import { UserContext } from "./UserContext";
import TodoList from "./TodoList";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function TodoSection() {
  const { todos, fetchTodos, location, creating_label, creating, setCreating} = useContext(UserContext);
  const createTaskRef = useRef(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (creating && createTaskRef.current) {
      createTaskRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [creating]);

  return (
    <>
      <div className="section-container">
        <div className="section-title todo-today-title">
          {location.slice(40, location.length)}
        </div>
        {todos && (
          <div className={`section-tasks`}>
            {todos
              .filter(
                (todo) => todo.section === location.slice(40, location.length)
              )
              .map((todo) => (
                <>
                <div className="section-task-list">
                  <TodoList key={todo.id} todo={todo} section={todo.section} />
                </div>
                </>
              ))}
              
          </div>
        )}
        <button
          onClick={()=>setCreating(!creating)}
          className="create-task"
        >
          <FontAwesomeIcon className="create-task-icon" icon={faPlus} />
          &nbsp;Create task
        </button>
        {creating && (
          <div ref={createTaskRef}>
            {creating_label()}
          </div>
          
        )}
      </div>
    </>
  );
}
