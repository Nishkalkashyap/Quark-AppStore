import React from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { NEW_ROUTES } from './data/routes';

import SignUpPage from './pages/signup-page';
import SignInPage from './pages/sign-in-page';
import EditProfilePage from './pages/edit-profile-page';
import ForgotPasswordPage from './pages/forgot-password-page';

import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { CreateNewRelease } from './pages/create-new-release-page';
import changePasswordPage from './pages/change-password-page';
import { ProjectsListPage } from './pages/project-list-page-2';
import { CreateNewProjectPage } from './pages/create-new-project-page';
import { ReleaseListPage } from './pages/release-list-page-2';
import { NotFoundComponent } from './components/common-components';
import { PageContainer } from './components/page-container';
import { EditProjectPage } from './pages/edit-project-page';
import { WriteProjectReviewPage } from './pages/write-project-review-page';
import { COLORS } from './util';
import { ProjectLandingPage } from './pages/project-landing-page';
import { ReviewsListPage } from './pages/reviews-list-page-2';
import { BrowseProjectsPage } from './pages/browse-projects-list-page';
import { withFirebase } from './providers/firebase-provider';
import { withMatchParams } from './providers/with-url-provider';
import { withSnackbar } from 'notistack';
import { ProjectReportAbusePage } from './pages/project-report-abuse-page';
import { AlgoliaInstantSearchPage } from './pages/algolia-instant-search-page';
// import { NotFoundComponent } from './components/common';

const Routing = () => (
  <React.Fragment>
    <Route exact path={NEW_ROUTES.LANDING_PAGE.base} component={BrowseProjectsPage} />
    {/* <Route exact path={NEW_ROUTES.LANDING_PAGE.base} component={AlgoliaInstantSearchPage} /> */}
    <Route exact path={NEW_ROUTES.DASHBOARD_PAGE.base} component={BrowseProjectsPage} />
    <Route exact path={NEW_ROUTES.EDIT_PROFILE_PAGE.base} component={EditProfilePage} />

    <Route exact path={NEW_ROUTES.SIGN_IN.base} component={SignInPage} />
    <Route exact path={NEW_ROUTES.SIGN_UP.base} component={SignUpPage} />

    {/* project-list */}
    <Route exact path={`/${NEW_ROUTES.PROJECTS_LIST_PAGE.base}`} component={ProjectsListPage} />
    <Route exact path={`${NEW_ROUTES.PROJECTS_LIST_PAGE.slug}/${NEW_ROUTES.PROJECTS_LIST_PAGE.base}`} component={ProjectsListPage} />

    <Route exact path={NEW_ROUTES.PASSWORD_FORGET_PAGE.base} component={ForgotPasswordPage} />
    <Route exact path={NEW_ROUTES.CHANGE_PASSWORD_PAGE.base} component={changePasswordPage} />

    <Route exact path={`${NEW_ROUTES.CREATE_RELEASE.slug}/${NEW_ROUTES.CREATE_RELEASE.base}`} component={CreateNewRelease} />
    <Route exact path={`${NEW_ROUTES.PROJECT_PAGE.slug}/${NEW_ROUTES.PROJECT_PAGE.base}`} component={ProjectLandingPage} />
    <Route exact path={`${NEW_ROUTES.RELEASE_LIST_PAGE.slug}/${NEW_ROUTES.RELEASE_LIST_PAGE.base}`} component={ReleaseListPage} />
    {/* <Route exact path={`${NEW_ROUTES.PROJECT_PAGE.base}/${SLUGS.Project}`} component={ReleaseListPage} /> */}
    <Route exact path={`${NEW_ROUTES.EDIT_PROJECT_PAGE.slug}/${NEW_ROUTES.EDIT_PROJECT_PAGE.base}`} component={EditProjectPage} />
    <Route exact path={NEW_ROUTES.CREATE_NEW_PROJECT_PAGE.base} component={CreateNewProjectPage} />
    <Route exact path={`${NEW_ROUTES.PROJECT_REVIEW_PAGE.slug}/${NEW_ROUTES.PROJECT_REVIEW_PAGE.base}`} component={WriteProjectReviewPage} />
    <Route exact path={`${NEW_ROUTES.REVIEW_LIST_PAGE.slug}/${NEW_ROUTES.REVIEW_LIST_PAGE.base}`} component={ReviewsListPage} />
    <Route exact path={`${NEW_ROUTES.REPORT_ABUSE_PAGE.slug}/${NEW_ROUTES.REPORT_ABUSE_PAGE.base}`} component={ProjectReportAbusePage} />

    <Route exact path={NEW_ROUTES.NOT_FOUND.base} component={NotFoundComponent} />
  </React.Fragment>
)
const StupidPageContainer: any = withRouter(withFirebase(withSnackbar(withMatchParams(PageContainer) as any)));

const theme = createMuiTheme({
  palette: {
    // primary: { main: '#2196F3' },
    primary: { main: COLORS.PRIMARY },
    secondary: { main: COLORS.ON_PRIMARY },
    background: {
      paper: '#f8f9f9',
      default: '#ffffff'
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
