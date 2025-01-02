import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import TodoList from "./TodoList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function TodoForm() {
  const { fetchTodos, todos, today_date } = useContext(UserContext);
  const [name, setName] = useState("");
  const [shrink, setShrink] = useState({
    today: false,
    overdue: false,
    upcoming: false,
  });

  
  


  useEffect(() => {
    fetchTodos();
  }, []);

  const create_todo = async (e, due_date) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/create_todo",
        { name, due_date },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      fetchTodos();
      setName("");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-today-title">Today</div>
      <div className="todo-today-content">
      
        <form
          className="todo-form"
          onSubmit={(e) => create_todo(e, today_date)}
        >
          <div className="input-container">
            <input
              required
              spellCheck="false"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Todo Name"
            ></input>
            <button type="submit">Create</button>
          </div>
        </form>

        {todos && todos.filter(todo => todo.due_date < today_date && !todo.completed).length >= 1 && (
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

        {todos && todos.filter(todo => todo.due_date === today_date && !todo.completed).length >= 1 ? (
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
        ) : (
          <div className="todo-info">No tasks for today!</div>
        )}

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
