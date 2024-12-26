import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser as faUserSolid,
  faSquareCheck as faSquareCheckSolid,
  faGear as faGearSolid,
  faArrowRightFromBracket as faArrowRightFromBracketSolid,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";

import {
  faUser as faUserRegular,
  faSquareCheck as faSquareCheckRegular,

} from "@fortawesome/free-regular-svg-icons";



import "./index.css";
import { UserContext } from "./UserContext";
import { Outlet, useNavigate } from "react-router-dom";

export default function Index() {
  const [expanded, setExpanded] = useState(true);
  const { user, logout } = useContext(UserContext);
  const [section, setSection] = useState("");
  const navigate = useNavigate();

  useEffect (() =>{
    setSection(localStorage.getItem("section"));
  },[])

  const logout_user = (e) => {
    logout(e);
    navigate("/login");
  }

  return (
    <>
      <div className="layout">
        <div className="sidenav">
          <div className="sidenav-header">
            <div className="logo">
              <FontAwesomeIcon className="logo-image-expanded" icon={faChartLine} />
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
                <a className={`nav-item ${section === "account" ? "background-active": ""}` } href="/account" onClick={()=>localStorage.setItem("section","account")}>
                  <FontAwesomeIcon className={`nav-item-icon ${section === "account" ? "text-active": ""}`}  icon={section === "account" ? faUserSolid : faUserRegular} />
                  <label className={`nav-label ${section === "account" ? "text-active": ""}`} >Account</label>
                </a>
                <a className={`nav-item ${section === "todo" ? "background-active": ""}` } href="/todo-list" onClick={()=>localStorage.setItem("section","todo")}>
                  <FontAwesomeIcon className={`nav-item-icon ${section === "todo" ? "text-active": ""}`}  icon={section === "todo" ? faSquareCheckSolid : faSquareCheckRegular}/>
                  <label className={`nav-label ${section === "todo" ? "text-active": ""}`}  >TodoList</label>
                </a>
                <a className={`nav-item ${section === "settings" ? "background-active": ""}` } href="/settings" onClick={()=>localStorage.setItem("section","settings")}>
                  <FontAwesomeIcon className={`nav-item-icon ${section === "settings" ? "text-active": ""}`} icon={faGearSolid} />
                  <label className={`nav-label ${section === "settings" ? "text-active": ""}`}  >Settings</label>
                </a>
              </nav>
            </div>
            <div className="sidebar-footer">
              {user.username ? (
                <div className="nav-user-info">
                  <label className="nav-label">{user.username}</label>
                  <button onClick={(e) => logout_user(e)} className="nav-logout">
                    <FontAwesomeIcon className="logout-button" icon={faArrowRightFromBracketSolid} />
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
