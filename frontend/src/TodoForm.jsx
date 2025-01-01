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
  const { fetchTodos, todos } = useContext(UserContext);
  const [name, setName] = useState("");
  const [shrink, setShrink] = useState({
    today: false,
    overdue: false,
    upcoming: false,
  });

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const today_date = `${year}-${month >= 10 ?  month : `0${month}`}-${day >= 10 ?  day : `0${day}`}`;
  


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
              spellCheck="false"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Todo Name"
            ></input>
            <button type="submit">Create</button>
          </div>
        </form>

        {todos.filter(todo => todo.due_date < today_date) && (
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
            <hr></hr>
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
                  <TodoList key={todo.id} todo={todo} fetchTodos={fetchTodos} />
                ))}
            </div>
          </div>
        )}

        {todos ? (
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
            <hr></hr>
            <div
              className={`todo-list-container ${shrink.today ? "shrink" : ""}`}
            >
              {todos
                .filter(
                  (todo) => todo.due_date === today_date && !todo.completed
                )
                .map((todo) => (
                  <TodoList key={todo.id} todo={todo} section={"Today"} />
                ))}
            </div>
          </div>
        ) : (
          <div className="todo-info">No tasks for today!</div>
        )}

        {todos.filter(todo => todo.due_date > today_date) && (
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
            <hr></hr>
            <div
              className={`todo-list-container ${
                shrink.upcoming ? "shrink" : ""
              }`}
            >
              {todos
                .filter((todo) => todo.due_date > today_date)
                .map((todo) => (
                  <TodoList key={todo.id} todo={todo} fetchTodos={fetchTodos} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
