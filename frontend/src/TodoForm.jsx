import { useContext, useEffect, useState, useRef} from "react";
import { UserContext } from "./UserContext";
import TodoList from "./TodoList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faPlus,
  
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function TodoForm() {
  const { fetchTodos, todos, today_date, creating_label, creating, setCreating} = useContext(UserContext);
  const [shrink, setShrink] = useState({
    today: false,
    overdue: false,
    upcoming: false,
  });
  const createTaskRef = useRef(null);

  const navigate = useNavigate()

  useEffect(() => {
    fetchTodos();
    if (fetchTodos() === "session-expired"){
      navigate("/session-expired")
    }
  }, []);

  useEffect(() => {
    if (creating && createTaskRef.current) {
      createTaskRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [creating]);


  return (
    <div className="todo-container">
      <div className="todo-today-title">Today</div>
      <div className="todo-today-content">

        {todos && todos.filter(todo => todo.due_date && todo.due_date < today_date && !todo.completed).length >= 1 && (
          <div className="overdue-tasks">
            <label
              onClick={() =>
                setShrink((prevState) => ({
                  ...prevState,
                  overdue: !shrink.overdue,
                }))
              }
              className="todo-filter-label"
            >
              Overdue tasks{" "}
              <FontAwesomeIcon
                className="dropdown-icon"
                icon={shrink.overdue ? faAngleUp : faAngleDown}
              />
            </label>
            <hr className="todo-filter-separator"></hr>
            <div
              className={`todo-list-container ${
                shrink.overdue ? "shrink" : ""
              }`}
            >
              {todos
                .filter(
                  (todo) =>
                    todo.due_date < today_date &&
                    todo.due_date &&
                    !todo.completed
                )
                .map((todo) => (
                  <TodoList key={todo.id} todo={todo} fetchTodos={fetchTodos} section={todo.section.length >= 1 ? todo.section : "None"}/>
                ))}
            </div>
          </div>
        )}

        {todos && todos.filter(todo => todo.due_date === today_date && !todo.completed).length >= 1 ? (<>
          <div className="today-tasks">
            <label
              onClick={() =>
                setShrink((prevState) => ({
                  ...prevState,
                  today: !shrink.today,
                }))
              }
              className="todo-filter-label"
            >
              Today's tasks{" "}
              <FontAwesomeIcon
                className="dropdown-icon"
                icon={shrink.today ? faAngleUp : faAngleDown}
              />
            </label>
            <hr className="todo-filter-separator"></hr>
            <div
              className={`todo-list-container ${shrink.today ? "shrink" : ""}`}
            >
              {todos
                .filter(
                  (todo) => todo.due_date === today_date && !todo.completed
                )
                .map((todo) => (
                  <TodoList key={todo.id} todo={todo} section={todo.section.length >= 1 ? todo.section : "None"} />
                ))}
            </div>
          </div>
          
          </>
        ) : (
          <div className="todo-info">No tasks for today!</div>
        )}

          <button
            onClick={(e)=>setCreating(!creating)}
            className="create-task"
          >
            <FontAwesomeIcon className="create-task-icon" icon={faPlus} />
            &nbsp;Create task
          </button>

          {creating && 
          <div ref={createTaskRef}>
            {creating_label()}
          </div>
          
          }

        {todos && todos.filter(todo => todo.due_date > today_date && !todo.completed).length >= 1 && (
          <div className="today-tasks">
            <label
              onClick={() =>
                setShrink((prevState) => ({
                  ...prevState,
                  upcoming: !shrink.upcoming,
                }))
              }
              className="todo-filter-label"
            >
              Upcoming tasks{" "}
              <FontAwesomeIcon
                className="dropdown-icon"
                icon={shrink.upcoming ? faAngleUp : faAngleDown}
              />
            </label>
            <hr className="todo-filter-separator"></hr>
            <div
              className={`todo-list-container ${
                shrink.upcoming ? "shrink" : ""
              }`}
            >
              {todos
                .filter((todo) => todo.due_date > today_date)
                .map((todo) => (
                  <TodoList key={todo.id} todo={todo} fetchTodos={fetchTodos} section={todo.section.length >= 1 ? todo.section : "None"} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
