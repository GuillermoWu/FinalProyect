import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'rsuite/dist/rsuite.min.css';  // or 'rsuite/styles/index.less';
import { UserProvider } from './UserContext.jsx'
import axios from 'axios'
import { CustomProvider } from 'rsuite';


axios.defaults.withCredentials = true

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <CustomProvider theme="dark">
        <App />
      </CustomProvider>
    </UserProvider>
  </StrictMode>
);
