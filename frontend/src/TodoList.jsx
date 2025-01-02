import React, { useState, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCalendarWeek} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "./UserContext";

export default function TodoList({ todo, section }) {
  const {todoSections, axiosRequest, today_date, today} =
    useContext(UserContext);
  const [todoItem, setTodoItem] = useState({
    updating: false,
    current: "",
    currentDueDate: "",
    section: "",
    priorityUpdating: { id: null, state: false },
    priorityLabelUpdating: {
      id: null,
      state: false,
      name: null,
      priority: null,
    },
  });

  const resetTodoItem = () => {
    setTodoItem({
      updating: false,
      current: "",
      currentDueDate: "",
      section: "",
      priorityUpdating: { id: null, state: false },
      priorityLabelUpdating: {
        id: null,
        state: false,
        name: null,
        priority: null,
      },
    });
  };

  const complete_todo = async (id, e, completed) => {
    e.preventDefault();
    axiosRequest("/api/complete_todo", "patch", { id, completed });
    //setTimeout(() => {
     // delete_todo(id, e);
    //}, 500);
  };

  const delete_todo = async (id, e) => {
    e.preventDefault();
    axiosRequest("/api/delete_todo", "post", { id });
  };

  const update_todo = async (e, id, name, due_date, section) => {
    e.preventDefault();
    axiosRequest("/api/update_todo", "patch", {
      id,
      name,
      due_date,
      section,
    });
    resetTodoItem();
  };

  const updatePriority = async (e, id, priority) => {
    e.preventDefault();
    setTodoItem((prevState) => ({ ...prevState, updating: false }));
    axiosRequest("/api/update_priority", "patch", { id, priority });
    setTodoItem((prevState) => ({
      ...prevState,
      priorityUpdating: { id: null, state: false },
    }));
  };

  const formatDate = (todoDate) =>{
    if (todoDate.length >=1)
    {
    const date = new Date(todoDate);
    const day = date.getDate(date);
    const month = date.toLocaleDateString('en-US', {month: 'short'});

    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const tday = tomorrow.getDate();
    const tmonth = tomorrow.getMonth() + 1;
    const tyear = tomorrow.getFullYear();
    const tomorrowDate = `${tyear}-${tmonth >= 10 ?  tmonth : `0${tmonth}`}-${tday >= 10 ?  tday : `0${tday}`}`;
  

      if (todoDate === today_date)
      {
        return "Today"
      }
      else if (todoDate === tomorrowDate)
      {
        return "Tomorrow"
      }
      else
      {
        return (`${day} ${month}`)
      }
    }
    else
    {
      return "No Due Date"
    }
  }

  const [priorities, setPriorities] = useState({
    0: { name: "Low", id: 0 },
    1: { name: "Medium", id: 1 },
    2: { name: "High", id: 2 },
  });


  const priorityDropdown = (todo) => {
    return (
      
      <div className="todo-priority-dropdown" style={todoItem.updating === todo.id ? {display:"none"} : {}}>
        <button
          onClick={(e) =>
            setTodoItem((prevState) => ({
              ...prevState,
              priorityUpdating: {
                id: todo.id,
                state: !todoItem.priorityUpdating.state,
              },
            }))
          }
          className={`todo-priority-dropdown-button ${
            todo.priority === 0
              ? "low"
              : todo.priority === 1
              ? "medium"
              : "high"
          }`}
        >
          {todo.priority === 0
            ? "Low"
            : todo.priority === 1
            ? "Medium"
            : "High"}{" "}
          Priority
        </button>
        {todoItem.priorityUpdating.id == todo.id &&
          todoItem.priorityUpdating.state &&(
            <div className={`todo-priority-dropdown-content`}>
              {Object.values(priorities)
                .filter((priority) => todo.priority !== priority.id)
                .map((priority) => (
                  <button
                    key={priority.id}
                    className="todo-priority-btn"
                    onClick={(e) => updatePriority(e, todo.id, priority.id)}
                  >
                    {priority.name} Priority
                  </button>
                ))}
            </div>
          )}
      </div>
    );
  };

  return (
    <div>
      <ul className="todo-list">
        {todo && (
          <React.Fragment key={todo.id}>
            <li key={todo.id}>
              <div className="todo-item" key={todo.id}>
                <input
                  style={
                    todoItem.updating === todo.id ? { display: "none" } : {}
                  }
                  className={`todo-checkbox ${
                    todo.completed ? "todo-checkbox-checked" : ""
                  }`}
                  onClick={(e) => complete_todo(todo.id, e, !todo.completed)}
                  value={todo.completed}
                  type="checkbox"
                ></input>
                {todoItem.updating === todo.id ? (
                  <>
                    <div key={todo.id} className="updating-todo-label">
                      <input
                        value={todoItem.current}
                        onChange={(e) =>
                          setTodoItem((prevState) => ({
                            ...prevState,
                            current: e.target.value,
                          }))
                        }
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
                            <option value={section}>{section}</option>
                            {section !== "None" && <option value="">None</option>}
                            {todoSections &&
                              todoSections.filter(todoSection => todoSection.name !== section).map((todoSection) => (
                                <option
                                  key={todoSection.id}
                                  value={todoSection.name}
                                >
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
                            setTodoItem((prevState) => ({
                              ...prevState,
                              updating: null,
                            }))
                          }
                        >
                          Cancel
                        </button>
                        <button
                          className="submit-btn"
                          onClick={(e) =>
                            update_todo(
                              e,
                              todo.id,
                              todoItem.current,
                              todoItem.currentDueDate,
                              todoItem.section.length >=1 ? todoItem.section : ""
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
                      setTodoItem((prevState) => ({
                        ...prevState,
                        updating: todo.id,
                        current: todo.name,
                        currentDueDate: todo.due_date,
                        section: todo.section,
                      }));
                    }}
                    className={`todo-item-label ${
                      todo.completed ? "completed-todo" : ""
                    }`}
                  >
                    {todo.name}
                  </label>
                )}

                <div>{priorityDropdown(todo)}</div>
                <FontAwesomeIcon
                  style={
                    todoItem.updating == todo.id ? { display: "none" } : {}
                  }
                  className="delete-todo-button"
                  onClick={(e) => delete_todo(todo.id, e)}
                  icon={faX}
                />
              </div>
            </li>
            <div className="todo-info-display">
              <div className="todo-duedate-display"><FontAwesomeIcon className="todo-duedate-icon" icon={faCalendarWeek} /><label>{formatDate(todo.due_date)}</label></div>
              <div className="todo-section-display">Section: <label className="todo-section-label">{todo.section.length >= 1 ? todo.section : section}</label></div>
            </div>
            <hr className="todolist-section-separator"></hr>
          </React.Fragment>
        )}
      </ul>
    </div>
  );
}
