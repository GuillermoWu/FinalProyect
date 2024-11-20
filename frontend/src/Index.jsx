import { useState } from "react";
import UserBadgeIcon from "@rsuite/icons/UserBadge";
import TaskIcon from '@rsuite/icons/Task';
import { Sidenav, Nav } from 'rsuite';
import SettingHorizontalIcon from '@rsuite/icons/SettingHorizontal';
import './index.css'

export default function Index() {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState('1');
    return (
      <div style={{ width: 240, height: 100}}>
        <Sidenav className="sidenav" expanded={expanded}>
          <Sidenav.Header>
            <div className="logo">
              <img className={expanded ? "logo-image-expanded" : "logo-image"} src="/images/logo.png" alt="Logo"></img>
              <label style={{display: expanded ? "inline" : "none"}} >Progressive Life</label>
            </div>
          </Sidenav.Header>
          <Sidenav.Body>
            <Nav activeKey={activeKey} onSelect={setActiveKey}>
              <Nav.Item eventKey="1" icon={<UserBadgeIcon />}>
                Account
              </Nav.Item>
              <Nav.Item eventKey="2" icon={<TaskIcon />}>
                TodoList
              </Nav.Item>
              <Nav.Item eventKey="4" icon={<SettingHorizontalIcon />}>
                Settings
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
          <Sidenav.Toggle onToggle={expanded => setExpanded(expanded)} />
        </Sidenav>
      </div>
  );
}


