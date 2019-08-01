import React from 'react';
import Sidebar from './components/sidebar-component';
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
import { CreateNewRelease } from './pages/create-new-release-page';
import changePasswordPage from './pages/change-password-page';
// import { ProjectsListPage } from './pages/project-list-page';
import { ProjectsListPage } from './pages/project-list-page-2';
import { CreateNewProjectPage } from './pages/create-new-project-page';
import { ReleaseListPage } from './pages/release-list-page-2';
import { NotFoundComponent } from './components/common-components';
import { PageContainer } from './components/page-container';
import MainBgComponent from './components/main-background-component';
import { EditProjectPage } from './pages/edit-project-page';
import { WriteProjectReviewPage } from './pages/write-project-review-page';
import { PRIMARY_COLOR } from './util';
import { ProjectLandingPage } from './pages/project-landing-page';
import { ReviewsListPage } from './pages/reviews-list-page';
// import { NotFoundComponent } from './components/common';

const Routing = () => (
  <React.Fragment>
    <Route exact path={ROUTES.LANDING_PAGE} component={Landing} />
    <Route exact path={ROUTES.ACCOUNT_PAGE} component={Account} />
    <Route exact path={ROUTES.EDIT_PROFILE_PAGE} component={EditProfilePage} />

    <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
    <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />

    {/* project-list */}
    <Route exact path={ROUTES.PROJECTS_LIST_PAGE} component={ProjectsListPage} />
    <Route exact path={`${ROUTES.PROJECTS_LIST_PAGE}/${SLUGS.PROJECTS_LIST_PAGE}`} component={ProjectsListPage} />

    <Route exact path={ROUTES.PASSWORD_FORGET_PAGE} component={ForgotPasswordPage} />
    <Route exact path={ROUTES.CHANGE_PASSWORD_PAGE} component={changePasswordPage} />
    <Route exact path={ROUTES.DASHBOARD_PAGE} component={Dashboard} />

    <Route exact path={`${ROUTES.NEW_RELEASE}/${SLUGS.NEW_RELEASE}/${POST_SLUG.NEW_RELEASE}`} component={CreateNewRelease} />
    <Route exact path={`${ROUTES.PROJECT_PAGE}/${SLUGS.Project}`} component={ProjectLandingPage} />
    <Route exact path={`${ROUTES.RELEASE_LIST_PAGE}/${SLUGS.Project}`} component={ReleaseListPage} />
    {/* <Route exact path={`${ROUTES.PROJECT_PAGE}/${SLUGS.Project}`} component={ReleaseListPage} /> */}
    <Route exact path={`${ROUTES.EDIT_PROJECT_PAGE}/${SLUGS.Project}`} component={EditProjectPage} />
    <Route exact path={ROUTES.CREATE_NEW_PROJECT_PAGE} component={CreateNewProjectPage} />
    <Route exact path={`${ROUTES.PROJECT_REVIEW_PAGE}/${SLUGS.PROJECT_REVIEW_PAGE}`} component={WriteProjectReviewPage} />
    <Route exact path={`${ROUTES.REVIEW_LIST_PAGE}/${SLUGS.PROJECT_REVIEW_PAGE}`} component={ReviewsListPage} />

    <Route exact path={ROUTES.NOT_FOUND} component={NotFoundComponent} />
  </React.Fragment>
)
const StupidSidebar: any = withRouter(withFirebase(Sidebar));
const StupidPageContainer: any = withRouter(withFirebase(PageContainer));

const theme = createMuiTheme({
  palette: {
    // primary: { main: '#2196F3' },
    primary: { main: PRIMARY_COLOR },
    background: {
      // default: '#f5f5f5'
      // default: '#ffffff'
      paper: '#f8f9f9',
      default : '#ffffff'
    }
  }
});


const App: React.FC = () => {
  return (
    <Router>
      {/* <MainBgComponent bgColor='linear-gradient(90deg ,#f6f6ff 0,#afc1cd 100%)' position="fixed"/> */}
      {/* <MainBgComponent bgColor='' position="fixed"/> */}
      {/* <MainBgComponent bgColor='linear-gradient(90deg ,#f6f6ff 0,rgba(0,0,0,0.2) 100%)' position="fixed" /> */}
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
