import { useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  
  return (<>
    <Router>
      <Switch>
        <Route exact path='/register' component={Register}/>
        <Route exact path='/login' component={Login}/>
        <ProtectedRoute exact path='/dashboard' component={Dashboard}/>
      </Switch>
    </Router>
  </>)
}

export default App
