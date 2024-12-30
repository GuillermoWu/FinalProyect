import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import Account from "./Account.jsx";
import LoginRequired from "./LoginRequired.jsx";
import Index from "./Index.jsx";
import TodoForm from "./TodoForm.jsx";
import TodoSection from "./TodoSection.jsx";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/account"
            element={
              <LoginRequired>
                <Account />
              </LoginRequired>
            }
          />
          <Route
            path="/todo-list/today"
            element={
              <LoginRequired>
                <TodoForm />
              </LoginRequired>
            }
          />
          <Route
            path="/todo-list/section"
            element={
              <LoginRequired>
                <TodoSection/>
              </LoginRequired>
            }
          />
          <Route path="*" element={<div>404 NOT FOUND</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
