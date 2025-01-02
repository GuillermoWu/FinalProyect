import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import TodoList from "./TodoList";
import { faPlus, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

export default function TodoSection() {
  const { todos, fetchTodos, todoSections} = useContext(UserContext);
  const location = window.location.href;
  const [creating, setCreating] = useState(false);
  const [todoItem, setTodoItem] = useState({
      updating: false,
      current: "",
      currentDueDate: "",
      section: location.slice(40, location.length),
      priorityUpdating: { id: null, state: false },
      priorityLabelUpdating: {
        id: null,
        state: false,
        name: null,
        priority: null,
      },
    });  

  useEffect(() => {
    fetchTodos();
  }, []);

  const create_todo = async (e, name, due_date, section) => {
    setCreating(!creating)
    e.preventDefault();
    try {
      await axios.post(
        "/api/create_todo",
        { name, due_date, section },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      fetchTodos();
    } catch (error) {
      alert(error);
    }
  };

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
          Create task
        </button>
        {creating && (
          <form onSubmit={(e) =>
            create_todo(
              e,
              todoItem.current,
              todoItem.currentDueDate,
              todoItem.section
            )
          } className="updating-todo-label">
            <input
              required
              value={todoItem.current}
              onChange={(e) =>
                setTodoItem((prevState) => ({
                  ...prevState,
                  current: e.target.value,
                }))
              }
              className="updating-todo-input"
            ></input>

            <label className="todo-description-label">Description</label>

            <div className="description-btns-container">
              <div className="description-btns-content">
                <input
                  type="date"
                  value={todoItem.currentDueDate}
                  onChange={(e) =>
                    setTodoItem((prevState) => ({
                      ...prevState,
                      currentDueDate: e.target.value,
                    }))
                  }
                  className="description-btn-date"
                ></input>
              </div>


              <div className="description-btns-content">
                <select
                  name="section"
                  className="description-btn-section"
                  onChange={(e) =>
                    setTodoItem((prevState) => ({
                      ...prevState,
                      section: e.target.value,
                    }))
                  }
                >
                  <option value={location.slice(40, location.length)}>{location.slice(40, location.length)}</option>
                  {todoSections &&
                    todoSections.filter(todoSection => todoSection.name !== location.slice(40, location.length)).map((todoSection) => (
                      <option key={todoSection.id} value={todoSection.name}>
                        {todoSection.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="updating-label-btns">
              <button
                className="cancel-btn"
                onClick={() =>
                  setCreating(!creating)
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
              >
                Create
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
