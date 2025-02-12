import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser as faUserSolid,
  faSquareCheck as faSquareCheckSolid,
  faGear as faGearSolid,
  faArrowRightFromBracket as faArrowRightFromBracketSolid,
  faChartLine,
  faPlus,
  faAngleUp,
  faAngleDown,
  faCalendarWeek,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import {
  faUser as faUserRegular,
  faSquareCheck as faSquareCheckRegular,
} from "@fortawesome/free-regular-svg-icons";

import "./index.css";
import { UserContext } from "./UserContext";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Index() {
  const url = "http://127.0.0.1:5173/";
  const location = window.location.href;
  const navigate = useNavigate();

  const { user, logout, fetchSections, fetchUser , todoSections} = useContext(UserContext);
  
  const [sectionExpanded, setSectionExpanded] = useState({
    state: false,
    name: null,
  });

  const [createSectionLabel, setCreateSectionLabel] = useState({
    state: false,
    name: "",
  });

 

  useEffect(() => {
    if (fetchUser() === "session-expired"){
      navigate("/session-expired")
    };
    try{
      fetchSections();
    }catch(error){
      navigate("/session-expired")
    }
    setSectionExpanded((prevState) => ({
      ...prevState,
      name: localStorage.getItem("subsection"),
      state: true && localStorage.getItem("subsection"),
    }));
  }, []);

  
  const logout_user = () => {
    logout();
    navigate("/login");
  };

 

  const create_section = async (e, name) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/create_section",
        { name },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      fetchSections();
    } catch (error) {
      alert(error);
    }
  };

  const delete_section = async (e, section_id) => {
    e.preventDefault();
    try{
      await axios.post(
        "/api/delete_section",
        { section_id },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      fetchSections()
    }catch(error){
      alert(error)
    }
  };

  return (
    <>
      <div className="layout">
        <div className="sidenav">
          <div className="sidenav-header">
            <div className="logo">
              <FontAwesomeIcon
                className="logo-image-expanded"
                icon={faChartLine}
              />
              <label
                className="nav-title"
              >
                Progressive Life
              </label>
            </div>
          </div>
          <hr style={{ color: "rgb(102, 98, 98)" }} />
          <div className="sidenav-body">
            <div className="sidenav-body-container">
              <nav>
                <a
                  className={`nav-item ${
                    location === `${url}account` && "background-active"
                  }`}
                  href="/account"
                >
                  <FontAwesomeIcon
                    className={`nav-item-icon ${
                      location === `${url}account` && "text-active"
                    }`}
                    icon={
                      location === `${url}account` ? faUserSolid : faUserRegular
                    }
                  />
                  <label
                    className={`nav-label ${
                      location === `${url}account` && "text-active"
                    }`}
                  >
                    Account
                  </label>
                </a>

                <div className="sidenav-dropdown">
                  <label
                    className={`nav-item ${
                     location.startsWith(`${url}todo-list/`) ? "background-active" : ""
                    }`}
                    onClick={() =>
                      setSectionExpanded((prevState) => ({
                        ...prevState,
                        state: !sectionExpanded.state,
                      }))
                    }
                  >
                    <FontAwesomeIcon
                      className={`nav-item-icon ${
                        location.startsWith(`${url}todo-list/`) ? "text-active" : ""
                      }`}
                      icon={
                        location.startsWith(`${url}todo-list/`)
                          ? faSquareCheckSolid
                          : faSquareCheckRegular
                      }
                    />
                    <label
                      className={`nav-label ${
                        location.startsWith(`${url}todo-list/`) ? "text-active" : ""
                      }`}
                    >
                      TodoList{" "}
                      <FontAwesomeIcon
                        className="dropdown-icon-sidenav"
                        icon={sectionExpanded.state ? faAngleDown : faAngleUp}
                      />
                    </label>
                  </label>

                  <div
                    className={`dropdown-content-sidenav ${
                      sectionExpanded.state ? "dropdown-content-sidenav-show" : ""
                    }`}
                  >
                    <a
                      className={`sidenav-section ${
                        sectionExpanded.name === "Today" &&
                        location === `${url}todo-list/today` &&
                        "subsection-active"
                      }`}
                      onClick={() =>
                        localStorage.setItem("subsection", "Today")
                       
                      }
                      href="/todo-list/today"
                    >
                      <FontAwesomeIcon
                        className="sidenav-section-icon"
                        icon={faCalendarWeek}
                      />
                      <label className="nav-label">Today</label>
                    </a>
                    {todoSections &&
                      todoSections.map((section) => (
                        <>
                        <React.Fragment key={section.id}>
                          <a  key={section.id}
                            className={`sidenav-section ${
                              sectionExpanded.name === section.name &&
                              location.startsWith(`${url}todo-list/`) &&
                              "subsection-active"
                            }`}
                            onClick={() =>
                              localStorage.setItem("subsection", section.name) 
                          
                            }
                            href={`/todo-list/section/${section.name}`}
                          >
                            <FontAwesomeIcon
                              className="sidenav-section-icon"
                              icon={faCalendarWeek}
                            />
                            <label key={section.id} className="nav-label">{section.name}</label>              
                            <FontAwesomeIcon
                             onClick={(e) => delete_section(e, section.id)}
                              className="delete-section-button"
                             icon={faTrashCan}
                           />
                          </a>
                          </React.Fragment>
                        </>
                      ))}

                    <label
                      onClick={() =>
                        setCreateSectionLabel((prevState) => ({
                          ...prevState,
                          state: !createSectionLabel.state,
                        }))
                      }
                      className="create-section"
                    >
                      <FontAwesomeIcon
                        className="create-section-icon"
                        icon={faPlus}
                      />
                      Create Section
                    </label>
                    <div
                      className={`create-section-label ${
                        createSectionLabel.state && "show-section-label"
                      }`}
                    >
                      <input
                        placeholder="Section Name"
                        value={createSectionLabel.name}
                        onChange={(e) =>
                          setCreateSectionLabel((prevState) => ({
                            ...prevState,
                            name: e.target.value,
                          }))
                        }
                      ></input>
                      <div className="create-section-btns">
                        <button
                          className="cancel-btn"
                          onClick={() =>
                            setCreateSectionLabel((prevState) => ({
                              ...prevState,
                              state: !createSectionLabel.state,
                            }))
                          }
                        >
                          Cancel
                        </button>
                        <button
                          className="submit-btn"
                          onClick={(e) =>
                            create_section(e, createSectionLabel.name)
                          }
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </nav>
            </div>
            <div className="sidebar-footer">
              {user.username ? (
                <div className="nav-user-info">
                  <label className="nav-label">{user.username}</label>
                  <button
                    onClick={() => logout_user()}
                    className="nav-logout"
                  >
                    <FontAwesomeIcon
                      className="logout-button"
                      icon={faArrowRightFromBracketSolid}
                    />
                  </button>
                </div>
              ) : (
                <a href="/login" className="sidebar-footer-button">
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </>
  );
}
