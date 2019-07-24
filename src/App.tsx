import React from 'react';
import './App.css';
import Header from './components/header/header.index';
import Sidebar from './components/sidebar/sidebar.index';
import PrivateRoute from './components/private-route';
import Dashboard from './components/dashboard/dashboard.index';
import LoginOrRegister from './components/login/login.index';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const Routing = () => (
  <Router>
    <div>
      <PrivateRoute path="/" component={Dashboard} />
      <Route path="/login" component={LoginOrRegister} />
    </div>
  </Router>
)

const App: React.FC = () => {
  return (
    <div className="App">
      <Header></Header>
      <div style={{ flexGrow: 1, display: 'flex' }}>
        <Sidebar></Sidebar>
        <div style={{ flexGrow: 1 }}>
          <Routing></Routing>
        </div>
      </div>
    </div>
  );
}

export default App;
