import React from 'react';
import './App.css';
import Header from './components/header-component';
import Sidebar from './components/sidebar-component';
// import PrivateRoute from './components/private-route';
import Dashboard from './pages/dashboard-page';
import Landing from './pages/landing-page';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { ROUTES, SLUGS, POST_SLUG } from './data/routes';

import SignUpPage from './pages/signup-page';
import SignInPage from './pages/sign-in-page';
import Account from './pages/account-page';
import EditProfilePage from './pages/edit-profile-page';
import ForgotPasswordPage from './pages/forgot-password-page';
import { withFirebase } from './providers/firebase-provider';

import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import { ViewProjectPage } from './pages/view-project-page';
import { CreateNewRelease } from './pages/create-new-release-page';
import changePasswordPage from './pages/change-password-page';
// import { NotFoundComponent } from './components/common';

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
    <Route path={ROUTES.PASSWORD_FORGET} component={ForgotPasswordPage} />
    <Route path={ROUTES.CHANGE_PASSWORD_PAGE} component={changePasswordPage} />
    
    <Route path={`${ROUTES.NewRelease}/${SLUGS.NewRelease}/${POST_SLUG.NewRelease}`} component={CreateNewRelease} exact />
    <Route path={`${ROUTES.Project}/${SLUGS.Project}`} component={ViewProjectPage} exact />
    {/* <Route path="*" component={NotFoundComponent} /> */}
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
