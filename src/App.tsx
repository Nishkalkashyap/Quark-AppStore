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
import { PageContainer } from './components/page-container';
import MainBgComponent from './components/main-background-component';
// import { NotFoundComponent } from './components/common';

const Routing = () => (
  <React.Fragment>
    <Route exact path={ROUTES.LANDING_PAGE} component={Landing} />
    <Route exact path={ROUTES.ACCOUNT_PAGE} component={Account} />
    <Route exact path={ROUTES.EDIT_PROFILE_PAGE} component={EditProfilePage} />

    <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
    <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
    <Route exact path={ROUTES.PROJECTS_LIST_PAGE} component={ProjectsListPage} />

    <Route exact path={ROUTES.PASSWORD_FORGET_PAGE} component={ForgotPasswordPage} />
    <Route exact path={ROUTES.CHANGE_PASSWORD_PAGE} component={changePasswordPage} />
    <Route exact path={ROUTES.DASHBOARD_PAGE} component={Dashboard} />

    <Route exact path={`${ROUTES.NEW_RELEASE}/${SLUGS.NEW_RELEASE}/${POST_SLUG.NEW_RELEASE}`} component={CreateNewRelease} />
    <Route exact path={`${ROUTES.PROJECT_PAGE}/${SLUGS.Project}`} component={ReleaseListPage} />
    <Route exact path={ROUTES.CREATE_NEW_PROJECT_PAGE} component={CreateNewProjectPage} />

    <Route exact path={ROUTES.NOT_FOUND} component={NotFoundComponent} />
  </React.Fragment>
)
const StupidSidebar: any = withRouter(withFirebase(Sidebar));
const StupidPageContainer: any = withRouter(withFirebase(PageContainer));

const theme = createMuiTheme({
  palette: {
    primary: { main: '#2196F3' },
    background: {
      default: '#f5f5f5'
    }
  }
});


const App: React.FC = () => {
  return (
    <Router>
          {/* <MainBgComponent></MainBgComponent> */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StupidPageContainer>
          <Routing />
        </StupidPageContainer>
        {/* <div className="App" style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Header></Header>
          <div style={{ flexGrow: 1, display: 'flex', height: 'calc(100% - 56px)' }}>
            <StupidSidebar ></StupidSidebar>
            <div style={{ flexGrow: 1, padding: '32px 40px', width: '100%', height: '100%', overflowY: 'auto' }} id="routes-container">
              <Routing></Routing>
            </div>
          </div>
        </div> */}
      </ThemeProvider>
    </Router>
  );
}

export default App;
