import { useState} from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";


export default function TodoList({ todos, fetch_todos }) {
  const [updating, setUpdating] = useState("");
  const [current, setCurrent] = useState("");
  
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to view your todos.");
    navigate("/login");
    return;
  }

  const complete_todo = async (id, e, completed) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "http://localhost:5000/complete_todo",
        { id, completed },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      fetch_todos();
    } catch (error) {
      alert(error);
    }
  };

  const delete_todo = async (id, e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/delete_todo",
        { id },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const data = await response.data;
      alert(data.message);
      fetch_todos();
    } catch (error) {
      alert(error);
    }
  };

  const update_todo = async (id, name) => {
    try {
      const response = await axios.patch(
        "http://localhost:5000/update_todo",
        { id, name },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const data = await response.data;
      alert(data.message);
      fetch_todos();
      setUpdating(null);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <ul className="todo-list">
        {todos ? (
          todos.map((todo) => (
            <li key={todo.id}>
              <div className="todo-item">
                <input
                  className={`todo-checkbox ${todo.completed ? "todo-checkbox-checked" : ""}`}
                  onClick={(e) => complete_todo(todo.id, e, !todo.completed)}
                  value={todo.completed}
                  type="checkbox"
                ></input>
                {updating == todo.id ? (
                  <>
                    <input
                      value={current}
                      onChange={(e) => setCurrent(e.target.value)}
                      className="updating-todo-input"
                    ></input>{" "}
                    <button onClick={() => update_todo(todo.id, current)}>
                      update
                    </button>
                    <button onClick={() => setUpdating(null)}>back</button>
                  </>
                ) : (
                  <label
                    onClick={() =>
                      setUpdating(todo.id) || setCurrent(todo.name)
                    }
                    className={`todo-item-label ${todo.completed ? "completed-todo" : ""}`}
                  >
                    {todo.name}
                  </label>
                )}
                <FontAwesomeIcon
                  className="delete-todo-button"
                  onClick={(e) => delete_todo(todo.id, e)}
                  icon={faX}
                />
              </div>
            </li>
          ))
        ) : (
          <div className="todo-info">No tasks for today!</div>
        )}
      </ul>
    </div>
    
  );
}
