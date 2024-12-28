import { useContext, useEffect, useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";

import {
  faUser as faUserRegular,
  faSquareCheck as faSquareCheckRegular,
} from "@fortawesome/free-regular-svg-icons";

import "./index.css";
import { UserContext } from "./UserContext";
import { Outlet, useNavigate } from "react-router-dom";

export default function Index() {
  const url = "http://127.0.0.1:5173/";
  const [expanded, setExpanded] = useState(true);
  const { user, logout, fetchUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [sectionExpanded, setSectionExpanded] = useState({
    state: false,
    name: null,
  });

  const [createSectionLabel, setCreateSectionLabel] = useState({
    state: false,
    name: "",
  });

  useEffect(() => {
    setSectionExpanded((prevState) => ({
      ...prevState,
      name: localStorage.getItem("subsection"),
      state: true && localStorage.getItem("subsection") === "Today",
    }));
  }, []);

  const logout_user = (e) => {
    logout(e);
    navigate("/login");
  };

  const create_section = async (e) => {
    e.preventDefault()
    try {
      const name = createSectionLabel.name
      await fetch(
        "api/create_section",
        {name},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      fetchUser();
    } catch (error) {
      alert(error);
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
                style={{ display: expanded ? "inline" : "none" }}
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
                    window.location.href === `${url}account` &&
                    "background-active"
                  }`}
                  href="/account"
                >
                  <FontAwesomeIcon
                    className={`nav-item-icon ${
                      window.location.href === `${url}account` && "text-active"
                    }`}
                    icon={
                      window.location.href === `${url}account`
                        ? faUserSolid
                        : faUserRegular
                    }
                  />
                  <label
                    className={`nav-label ${
                      window.location.href === `${url}account` && "text-active"
                    }`}
                  >
                    Account
                  </label>
                </a>

                <div className="sidenav-dropdown">
                  <label
                    className={`nav-item ${
                      window.location.href === `${url}todo-list` &&
                      "background-active"
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
                        window.location.href === `${url}todo-list` &&
                        "text-active"
                      }`}
                      icon={
                        window.location.href === `${url}todo-list`
                          ? faSquareCheckSolid
                          : faSquareCheckRegular
                      }
                    />
                    <label
                      className={`nav-label ${
                        window.location.href === `${url}todo-list` &&
                        "text-active"
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
                      sectionExpanded.state && "dropdown-content-sidenav-show"
                    }`}
                  >
                    <a
                      className={`sidenav-section ${
                        sectionExpanded.name === "Today" &&
                        window.location.href === `${url}todo-list` &&
                        "subsection-active"
                      }`}
                      onClick={() =>
                        localStorage.setItem("subsection", "Today")
                      }
                      href="/todo-list"
                    >
                      <FontAwesomeIcon
                        className="sidenav-section-icon"
                        icon={faCalendarWeek}
                      />
                      <label className="nav-label">Today</label>
                    </a>
                    {user.sections &&
                      user.sections.map((section) => (
                        <a
                          className={`sidenav-section ${
                            sectionExpanded.name === section.name &&
                            window.location.href === `${url}todo-list` &&
                            "subsection-active"
                          }`}
                          onClick={() =>
                            localStorage.setItem("subsection", section.name)
                          }
                          href="/todo-list"
                        >
                          <FontAwesomeIcon
                            className="sidenav-section-icon"
                            icon={faCalendarWeek}
                          />
                          <label className="nav-label">{section.name}</label>
                        </a>
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
                    <form
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
                        <button className="cancel-btn" onClick={(e)=>setCreateSectionLabel((prevState)=>({...prevState, state:!createSectionLabel.state}))}>Cancel</button>
                        <button className="submit-btn" onSubmit={(e)=>create_section(e)}>Create</button>
                      </div>
                      
                    </form>
                  </div>
                </div>

                <a
                  className={`nav-item ${
                    window.location.href === `${url}settings` &&
                    "background-active"
                  }`}
                  href="/settings"
                  onClick={() => localStorage.setItem("section", "settings")}
                >
                  <FontAwesomeIcon
                    className={`nav-item-icon ${
                      window.location.href === `${url}settings` && "text-active"
                    }`}
                    icon={faGearSolid}
                  />
                  <label
                    className={`nav-label ${
                      window.location.href === `${url}settings` && "text-active"
                    }`}
                  >
                    Settings
                  </label>
                </a>
              </nav>
            </div>
            <div className="sidebar-footer">
              {user.username ? (
                <div className="nav-user-info">
                  <label className="nav-label">{user.username}</label>
                  <button
                    onClick={(e) => logout_user(e)}
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
