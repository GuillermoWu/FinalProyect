import { useState } from "react";
import UserBadgeIcon from "@rsuite/icons/UserBadge";
import TaskIcon from '@rsuite/icons/Task';
import { Sidenav, Nav } from 'rsuite';
import SettingHorizontalIcon from '@rsuite/icons/SettingHorizontal';

export default function Index() {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState('1');
    return (
      <div style={{ width: 240, height: 100}}>
        <Sidenav expanded={expanded} defaultOpenKeys={['3', '4']}>
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


