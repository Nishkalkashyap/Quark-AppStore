import React from 'react';
import './App.css';
import Header from './components/header/header.index';
import Sidebar from './components/sidebar/sidebar.index';
import PrivateRoute from './components/private-route';
import Dashboard from './components/dashboard/dashboard.index';
// import LoginOrRegister from './components/login/login.index';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ROUTES } from './data/routes';

import SignUpPage from './components/login/signup';
import SignInPage from './components/login/signin';
import PasswordForgetPage from './components/login/passwordForget';

const Routing = () => (
  <Router>
    <div>
      <PrivateRoute path={ROUTES.LANDING} component={Dashboard} />
      <PrivateRoute path={ROUTES.ACCOUNT} component={Dashboard} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
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
