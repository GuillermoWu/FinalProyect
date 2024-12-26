import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { faFlag } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

export default function TodoList({ todos, fetch_todos, section }) {
  const [todoItem, setTodoItem] = useState({
    updating: false,
    current: "",
    currentDueDate: "",
    section:"",
    priorityUpdating: { id: null, state: false },
    priorityLabelUpdating: { id: null, state: false, name: null, priority: null },
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to view your todos.");
      navigate("/login");
    }
  }, [navigate]);

  const complete_todo = async (id, e, completed) => {
    e.preventDefault();
    try {
      await axios.patch(
        "http://localhost:5000/complete_todo",
        { id, completed },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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
      await axios.post(
        "http://localhost:5000/delete_todo",
        { id },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      fetch_todos();
    } catch (error) {
      alert(error);
    }
  };

  const update_todo = async (e, id, name, priority, due_date, section) => {
    e.preventDefault();
    try {
      await axios.patch(
        "http://localhost:5000/update_todo",
        { id, name, due_date, priority, section },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      fetch_todos();
      setTodoItem((prevState)=>({...prevState, current:"", currentDueDate:"", section:"", updating:false, priorityUpdating:{ id: null, state: false, name:null, priority:null}}));
    } catch (error) {
      alert(error);
    }
  };

  const updatePriority = async (e, id, priority) => {
    e.preventDefault();
    setTodoItem((prevState)=>({...prevState, updating:false}));
    try {
      await axios.patch(
        "http://localhost:5000/update_priority",
        { id, priority },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      fetch_todos();
      setTodoItem((prevState)=>({...prevState, priorityUpdating:{ id: null, state: false }}));
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
              todo.section === section && (
                  <React.Fragment key={todo.id}>
                    <li key={todo.id}>
                      <div className="todo-item" key={todo.id}>
                        <input
                          style={todoItem.updating == todo.id ? { display: "none" } : {}}
                          className={`todo-checkbox ${
                            todo.completed ? "todo-checkbox-checked" : ""
                          }`}
                          onClick={(e) =>
                            complete_todo(todo.id, e, !todo.completed)
                          }
                          value={todo.completed}
                          type="checkbox"
                        ></input>
                        {todoItem.updating == todo.id ? (
                          <>
                            <div key={todo.id} className="updating-todo-label">
                              <input
                                value={todoItem.current}
                                onChange={(e) => setTodoItem((prevState)=>({...prevState, current:e.target.value}))}
                                className="updating-todo-input"
                              ></input>

                              <label className="todo-description-label">
                                Description
                              </label>

                              <div className="description-btns-container">
                                <div className="description-btns-content">
                                  <input
                                    type="date"
                                    value={todoItem.currentDueDate}
                                    onChange={(e) =>
                                      setTodoItem((prevState)=>({...prevState, currentDueDate:e.target.value}))
                                    }
                                    className="description-btn-date"
                                  ></input>
                                </div>

                                <div className="description-btns-content">
                                  <button
                                    className="description-btn-priority"
                                    onClick={(e) =>
                                      setTodoItem((prevState)=>({...prevState, priorityLabelUpdating: { id: todo.id, state: !todoItem.priorityLabelUpdating.state } }))
                                    }
                                  >
                                    {" "}
                                    <FontAwesomeIcon icon={faFlag} />{" "}
                                    {todoItem.priorityLabelUpdating.name
                                      ? todoItem.priorityLabelUpdating.name
                                      : "Priority"}
                                  </button>
                                  <div
                                    className={`label-dropdown-content ${
                                      todoItem.priorityLabelUpdating.id == todo.id &&
                                      todoItem.priorityLabelUpdating.state == true
                                        ? "show-priority-content"
                                        : ""
                                    }`}
                                  >
                                    <button
                                      className="todo-priority-btn"
                                      onClick={(e) =>
                                        setTodoItem((prevState)=>({...prevState,priorityLabelUpdating:{
                                          name: "Low Priority",
                                          state: false,
                                          priority: 0,
                                        }}))
                                      }
                                    >
                                      Low Priority
                                    </button>
                                    <button
                                      className="todo-priority-btn"
                                      onClick={(e) =>
                                        setTodoItem((prevState)=>({...prevState, priorityLabelUpdating:{
                                          name: "Medium Priority",
                                          state: false,
                                          priority: 1,
                                        }}))
                                      }
                                    >
                                      Medium Priority
                                    </button>
                                    <button
                                      className="todo-priority-btn"
                                      onClick={(e) =>
                                        setTodoItem((prevState)=>({...prevState, priorityLabelUpdating:{
                                          name: "High Priority",
                                          state: false,
                                          priority: 2,
                                        }}))
                                      }
                                    >
                                      High Priority
                                    </button>
                                  </div>
                                </div>

                                <div className="description-btns-content">
                                  <select name="section" className="description-btn-section">
                                      <option value={todoItem.section} onChange={(e) => setTodoItem((prevState)=>({...prevState, section:e.target.value}))} className="description-btn-section">Today</option>
                                  </select>
                                </div>
                              </div>
                              <div className="updating-label-btns">
                                <button
                                  className="cancel-btn"
                                  onClick={() => setTodoItem((prevState)=>({...prevState,updating:null}))}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="save-btn"
                                  onClick={(e) =>
                                    update_todo(
                                      e,
                                      todo.id,
                                      todoItem.current,
                                      todoItem.priorityLabelUpdating.priority,
                                      todoItem.currentDueDate,
                                      todoItem.section
                                    )
                                  }
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          // Display the todo name

                          <label
                            onClick={() => {
                              setTodoItem((prevState)=>({...prevState, updating:todo.id, current:todo.name, section: todo.section, currentDueDate:todo.due_date, priorityLabelUpdating:""}));
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
                                todoItem.updating == todo.id ? { display: "none" } : {}
                              }
                            >
                              <button
                                className="todo-priority-btn-low"
                                onClick={(e) =>
                                  setTodoItem((prevState)=>({...prevState, priorityUpdating:{
                                    id: todo.id,
                                    state: !todoItem.priorityUpdating.state,
                                  }}))
                                }
                              >
                                Low Priority
                              </button>
                              <div
                                className={`todo-priority-dropdown-content ${
                                  todoItem.priorityUpdating.id == todo.id &&
                                  todoItem.priorityUpdating.state == true
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
                                  todoItem.updating == todo.id ? { display: "none" } : {}
                                }
                              >
                                <button
                                  className="todo-priority-btn-medium"
                                  onClick={(e) =>
                                    setTodoItem((prevState)=>({...prevState, priorityUpdating:{
                                      id: todo.id,
                                      state: !todoItem.priorityUpdating.state,
                                    }}))
                                  }
                                >
                                  Medium Priority
                                </button>
                                <div
                                  className={`todo-priority-dropdown-content ${
                                    todoItem.priorityUpdating.id == todo.id &&
                                    todoItem.priorityUpdating.state == true
                                      ? "show-priority-content"
                                      : ""
                                  }`}
                                >
                                  <button
                                    className="todo-priority-btn"
                                    onClick={(e) =>
                                      updatePriority(e, todo.id, 0)
                                    }
                                  >
                                    Low Priority
                                  </button>
                                  <button
                                    className="todo-priority-btn"
                                    onClick={(e) =>
                                      updatePriority(e, todo.id, 2)
                                    }
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
                                  todoItem.updating == todo.id ? { display: "none" } : {}
                                }
                              >
                                <button
                                  className="todo-priority-btn-high"
                                  onClick={(e) =>
                                    setTodoItem((prevState)=>({...prevState, priorityUpdating:{
                                      id: todo.id,
                                      state: !todoItem.priorityUpdating.state,
                                    }}))
                                  }
                                >
                                  High Priority
                                </button>
                                <div
                                  className={`todo-priority-dropdown-content ${
                                    todoItem.priorityUpdating.id == todo.id &&
                                    todoItem.priorityUpdating.state == true
                                      ? "show-priority-content"
                                      : ""
                                  }`}
                                >
                                  <button
                                    className="todo-priority-btn"
                                    onClick={(e) =>
                                      updatePriority(e, todo.id, 0)
                                    }
                                  >
                                    Low Priority
                                  </button>
                                  <button
                                    className="todo-priority-btn"
                                    onClick={(e) =>
                                      updatePriority(e, todo.id, 1)
                                    }
                                  >
                                    Medium Priority
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <FontAwesomeIcon
                          style={todoItem.updating == todo.id ? { display: "none" } : {}}
                          className="delete-todo-button"
                          onClick={(e) => delete_todo(todo.id, e)}
                          icon={faX}
                        />
                      </div>
                    </li>
                    <hr className="todolist-section-separator"></hr>
                  </React.Fragment>
              )
          )
        ) : (
          <div className="todo-info">No tasks for today!</div>
        )}
      </ul>
    </div>
  );
}
