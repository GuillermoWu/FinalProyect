import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { faFlag, faCalendar } from "@fortawesome/free-regular-svg-icons";

export default function TodoList({ todos, fetch_todos, section }) {
  const [updating, setUpdating] = useState("");
  const [current, setCurrent] = useState("");
  const [priorityUpdating, setPriorityUpdating] = useState({
    id: null,
    state: false,
  });
  const [priorityLabelUpdating, setPriorityLabelUpdating] = useState({
    id: null,
    state: false,
    name: null,
    priority: null,
  });

  const [currentDueDate, setCurrentDueDate] = useState("");

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
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetch_todos();
      setTimeout(() => {
        delete_todo(id, e);
      }, 500);
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
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetch_todos();
    } catch (error) {
      alert(error);
    }
  };

  const update_todo = async (e, id, name, priority, due_date) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "http://localhost:5000/update_todo",
        { id, name, due_date, priority },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetch_todos();
      setUpdating(null);
      setPriorityUpdating({ id: null, state: false });
    } catch (error) {
      alert(error);
    }
  };

  const updatePriority = async (e, id, priority) => {
    e.preventDefault();
    setUpdating(false);
    try {
      const response = await axios.patch(
        "http://localhost:5000/update_priority",
        { id, priority },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetch_todos();
      setPriorityUpdating({ id: null, state: false });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <ul className="todo-list">
        {todos ? (
          todos.map(
            (todo) =>
              todo.section == section && (
                <>
                  <li key={todo.id}>
                    <div className="todo-item">
                      <input
                        style={updating == todo.id ? { display: "none" } : {}}
                        className={`todo-checkbox ${
                          todo.completed ? "todo-checkbox-checked" : ""
                        }`}
                        onClick={(e) =>
                          complete_todo(todo.id, e, !todo.completed)
                        }
                        value={todo.completed}
                        type="checkbox"
                      ></input>
                      {updating == todo.id ? (
                        <>
                          <div key={todo.id} className="updating-todo-label">
                            <input
                              value={current}
                              onChange={(e) => setCurrent(e.target.value)}
                              className="updating-todo-input"
                            ></input>

                            <label className="todo-description-label">
                              Description
                            </label>

                            <div className="description-btns-container">
                              <div className="description-btns-content">
                                <input
                                  type="date"
                                  value={currentDueDate}
                                  onChange={(e) =>
                                    setCurrentDueDate(e.target.value)
                                  }
                                  className="description-btn-date"
                                ></input>
                              </div>

                              <div className="description-btns-content">
                                <button
                                  className="description-btn-priority"
                                  onClick={(e) =>
                                    setPriorityLabelUpdating({
                                      id: todo.id,
                                      state: !priorityLabelUpdating.state,
                                    })
                                  }
                                >
                                  {" "}
                                  <FontAwesomeIcon icon={faFlag} />{" "}
                                  {priorityLabelUpdating.name
                                    ? priorityLabelUpdating.name
                                    : "Priority"}
                                </button>
                                <div
                                  className={`label-dropdown-content ${
                                    priorityLabelUpdating.id == todo.id &&
                                    priorityLabelUpdating.state == true
                                      ? "show-priority-content"
                                      : ""
                                  }`}
                                >
                                  <button
                                    className="todo-priority-btn"
                                    onClick={(e) =>
                                      setPriorityLabelUpdating({
                                        name: "Low Priority",
                                        state: false,
                                        priority: 0,
                                      })
                                    }
                                  >
                                    Low Priority
                                  </button>
                                  <button
                                    className="todo-priority-btn"
                                    onClick={(e) =>
                                      setPriorityLabelUpdating({
                                        name: "Medium Priority",
                                        state: false,
                                        priority: 1,
                                      })
                                    }
                                  >
                                    Medium Priority
                                  </button>
                                  <button
                                    className="todo-priority-btn"
                                    onClick={(e) =>
                                      setPriorityLabelUpdating({
                                        name: "High Priority",
                                        state: false,
                                        priority: 2,
                                      })
                                    }
                                  >
                                    High Priority
                                  </button>
                                </div>
                              </div>

                              <div className="description-btns-content">
                                <button className="description-btn">
                                  {""}
                                  <FontAwesomeIcon icon={faPaperclip} /> Section
                                </button>
                              </div>
                            </div>
                            <div className="updating-label-btns">
                              <button
                                className="cancel-btn"
                                onClick={() => setUpdating(null)}
                              >
                                Cancel
                              </button>
                              <button
                                className="save-btn"
                                onClick={(e) =>
                                  update_todo(
                                    e,
                                    todo.id,
                                    current,
                                    priorityLabelUpdating.priority,
                                    currentDueDate
                                  )
                                }
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <label
                          onClick={() =>{
                            setUpdating(todo.id);
                            setCurrent(todo.name);
                            setCurrentDueDate(todo.due_date);
                          }}
                          className={`todo-item-label ${
                            todo.completed ? "completed-todo" : ""
                          }`}
                        >
                          {todo.name}
                        </label>
                      )}
                      <div>
                        {todo.priority == 0 ? (
                          <div
                            className="todo-priority-dropdown"
                            style={
                              updating == todo.id ? { display: "none" } : {}
                            }
                          >
                            <button
                              className="todo-priority-btn-low"
                              onClick={(e) =>
                                setPriorityUpdating({
                                  id: todo.id,
                                  state: !priorityUpdating.state,
                                })
                              }
                            >
                              Low Priority
                            </button>
                            <div
                              className={`todo-priority-dropdown-content ${
                                priorityUpdating.id == todo.id &&
                                priorityUpdating.state == true
                                  ? "show-priority-content"
                                  : ""
                              }`}
                            >
                              <button
                                className="todo-priority-btn"
                                onClick={(e) => updatePriority(e, todo.id, 1)}
                              >
                                Medium Priority
                              </button>
                              <button
                                className="todo-priority-btn"
                                onClick={(e) => updatePriority(e, todo.id, 2)}
                              >
                                High Priority
                              </button>
                            </div>
                          </div>
                        ) : todo.priority == 1 ? (
                          <>
                            <div
                              className="todo-priority-dropdown"
                              style={
                                updating == todo.id ? { display: "none" } : {}
                              }
                            >
                              <button
                                className="todo-priority-btn-medium"
                                onClick={(e) =>
                                  setPriorityUpdating({
                                    id: todo.id,
                                    state: !priorityUpdating.state,
                                  })
                                }
                              >
                                Medium Priority
                              </button>
                              <div
                                className={`todo-priority-dropdown-content ${
                                  priorityUpdating.id == todo.id &&
                                  priorityUpdating.state == true
                                    ? "show-priority-content"
                                    : ""
                                }`}
                              >
                                <button
                                  className="todo-priority-btn"
                                  onClick={(e) => updatePriority(e, todo.id, 0)}
                                >
                                  Low Priority
                                </button>
                                <button
                                  className="todo-priority-btn"
                                  onClick={(e) => updatePriority(e, todo.id, 2)}
                                >
                                  High Priority
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              className="todo-priority-dropdown"
                              style={
                                updating == todo.id ? { display: "none" } : {}
                              }
                            >
                              <button
                                className="todo-priority-btn-high"
                                onClick={(e) =>
                                  setPriorityUpdating({
                                    id: todo.id,
                                    state: !priorityUpdating.state,
                                  })
                                }
                              >
                                High Priority
                              </button>
                              <div
                                className={`todo-priority-dropdown-content ${
                                  priorityUpdating.id == todo.id &&
                                  priorityUpdating.state == true
                                    ? "show-priority-content"
                                    : ""
                                }`}
                              >
                                <button
                                  className="todo-priority-btn"
                                  onClick={(e) => updatePriority(e, todo.id, 0)}
                                >
                                  Low Priority
                                </button>
                                <button
                                  className="todo-priority-btn"
                                  onClick={(e) => updatePriority(e, todo.id, 1)}
                                >
                                  Medium Priority
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <FontAwesomeIcon
                        style={updating == todo.id ? { display: "none" } : {}}
                        className="delete-todo-button"
                        onClick={(e) => delete_todo(todo.id, e)}
                        icon={faX}
                      />
                    </div>
                  </li>
                  <hr className="todolist-section-separator"></hr>
                </>
              )
          )
        ) : (
          <div className="todo-info">No tasks for today!</div>
        )}
      </ul>
    </div>
  );
}
