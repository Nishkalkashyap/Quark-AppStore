import React from 'react';
import './App.css';
import Header from './components/header/header.index';
import Sidebar from './components/sidebar/sidebar.index';
// import PrivateRoute from './components/private-route';
import Dashboard from './components/dashboard/dashboard.index';
import Landing from './components/dashboard/landing';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { ROUTES } from './data/routes';

import SignUpPage from './components/login/signup';
import SignInPage from './components/login/signin';
import Account from './components/account/account';
import EditProfilePage from './components/login/editProfile';
import PasswordForgetPage from './components/login/passwordForget';
import { withFirebase } from './services/firebase/firebase.index';

import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import { ViewProjectPage } from './components/account/view-project-page';

const Routing = () => (
  <React.Fragment>
    <Route path={ROUTES.LANDING} component={Landing} exact />
    <Route path={ROUTES.DASHBOARD} component={Dashboard} />
    <Route path={ROUTES.ACCOUNT} component={Account} />
    <Route path={ROUTES.EditProfile} component={EditProfilePage} />
    {/* <PrivateRoute path={ROUTES.LANDING} component={Landing} exact />
    <PrivateRoute path={ROUTES.DASHBOARD} component={Dashboard} />
    <PrivateRoute path={ROUTES.ACCOUNT} component={Account} /> */}
    <Route path={ROUTES.SIGN_IN} component={SignInPage} />
    <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
    <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
    <Route path={ROUTES.Project} component={ViewProjectPage} />
  </React.Fragment>
)
const StupidTypescript: any = withRouter(withFirebase(Sidebar));

const theme = createMuiTheme({
  palette: {
    primary: { main: '#055af9' }
  },
});


const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Header></Header>
          <div style={{ flexGrow: 1, display: 'flex' }}>
            <StupidTypescript ></StupidTypescript>
            <div style={{ flexGrow: 1 }}>
              <Routing></Routing>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
