import { useContext, useState, useEffect } from "react";
import UserBadgeIcon from "@rsuite/icons/UserBadge";
import TaskIcon from "@rsuite/icons/Task";
import { Sidenav, Nav, IconButton } from "rsuite";
import "./index.css";
import { UserContext } from "./UserContext";
import { Outlet } from "react-router-dom";
import GearIcon from "@rsuite/icons/Gear";
import { useNavigate } from "react-router-dom";
import ExitIcon from '@rsuite/icons/Exit';

export default function Index() {
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState("1");
  const { user , logout} = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <div style={{ width: 240, height: 100 }}>
        <Sidenav className="sidenav" expanded={expanded}>
          <Sidenav.Header>
            <div className="logo">
              <img
                className={expanded ? "logo-image-expanded" : "logo-image"}
                src="/images/logo.png"
                alt="Logo"
              ></img>
              <label className="nav-title" style={{ display: expanded ? "inline" : "none" }}>
                Progressive Life
              </label>
            </div>
          </Sidenav.Header>
          <hr style={{ color: "rgb(102, 98, 98)" }}></hr>
          <Sidenav.Body>
            <div className="sidenav-body-container">
              <Nav activeKey={activeKey} onSelect={setActiveKey}>
                <Nav.Item className="nav-item" eventKey="1" href="/account" icon={<UserBadgeIcon />}>
                  <label className="nav-label">Account</label>
                </Nav.Item>
                <Nav.Item className="nav-item" eventKey="2" href="/todo-list" icon={<TaskIcon />}>
                  <label className="nav-label">TodoList</label>
                </Nav.Item>
                <Nav.Item className="nav-item" eventKey="3" icon={<GearIcon />}>
                  <label className="nav-label">Settings</label>
                </Nav.Item>
              </Nav>
              <div className="sidebar-footer">
                  {user.username ? (<>
                    <div className="nav-user-info">
                      <label className="nav-label">{user.username}</label>
                      <IconButton onClick={(e)=>logout(e)} className="nav-logout" icon={<ExitIcon/>}/>
                    </div>
                    </>
                  ) : (
                    <a href="/login" className="sidebar-footer-button">
                      Login
                    </a>
                  )}
                </div>
            </div>
          </Sidenav.Body>
        </Sidenav>
      </div>
      <Outlet></Outlet>
    </>
  );
}
