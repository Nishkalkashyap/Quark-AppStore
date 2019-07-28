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
import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { ViewProjectPage } from './pages/view-project-page';
import { CreateNewRelease } from './pages/create-new-release-page';
import changePasswordPage from './pages/change-password-page';
import { ProjectsListPage } from './pages/project-list-page';
import { CreateNewProjectPage } from './pages/create-new-project-page';
// import { ReleaseListPage } from './pages/release-list-page';
import { ReleaseListPage } from './pages/release-list-page';
import { NotFoundComponent } from './components/common-components';
// import { NotFoundComponent } from './components/common';

const Routing = () => (
  <React.Fragment>
    <Route exact path={ROUTES.LANDING} component={Landing} />
    <Route exact path={ROUTES.ACCOUNT} component={Account} />
    <Route exact path={ROUTES.EditProfile} component={EditProfilePage} />

    <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
    <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
    <Route exact path={ROUTES.ProjectsListPage} component={ProjectsListPage} />

    <Route exact path={ROUTES.PASSWORD_FORGET} component={ForgotPasswordPage} />
    <Route exact path={ROUTES.CHANGE_PASSWORD_PAGE} component={changePasswordPage} />
    <Route exact path={ROUTES.DASHBOARD} component={Dashboard} />

    <Route exact path={`${ROUTES.NewRelease}/${SLUGS.NewRelease}/${POST_SLUG.NewRelease}`} component={CreateNewRelease} />
    <Route exact path={`${ROUTES.Project}/${SLUGS.Project}`} component={ReleaseListPage} />
    <Route exact path={ROUTES.CREATE_NEW_PROJECT_PAGE} component={CreateNewProjectPage} />
    
    <Route exact path={ROUTES.NOT_FOUND} component={NotFoundComponent} />
  </React.Fragment>
)
const StupidTypescript: any = withRouter(withFirebase(Sidebar));

const theme = createMuiTheme({
  palette: {
    primary: { main: '#055af9' }
  }
});


const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App" style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Header></Header>
          <div style={{ flexGrow: 1, display: 'flex', height: 'calc(100% - 56px)' }}>
            <StupidTypescript ></StupidTypescript>
            <div style={{ flexGrow: 1, padding: '32px 40px', width: '100%', height: '100%', overflowY: 'auto' }} id="routes-container">
              <Routing></Routing>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
