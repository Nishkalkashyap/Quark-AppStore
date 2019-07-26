// type allRoutes = 'login' | 'signup';

// type Route = {
//     [key :string]: string;
// }

export const ROUTES = {
    LANDING: '/',
    DASHBOARD: '/dashboard',
    SIGN_UP: '/signup',
    SIGN_IN: '/signin',
    EditProfile: '/edit-profile',
    CHANGE_PASSWORD_PAGE: '/change-password',
    PASSWORD_FORGET: '/forgot-password',
    ACCOUNT: '/account',
    Project: '/project',
    ProjectsListPage: '/projects',
    NewRelease: '/project',
}

export const MATCH_PARAMS = {
    USER_ID: 'userId',
    PROJECT_ID: 'projectId'
}

export const SLUGS = {
    Project: `:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`,
    NewRelease: `:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`
}

export const POST_SLUG = {
    NewRelease: 'create-release'
}
// type Route = {
//     [key in allRoutes]: {
//         link: string;
//         component: any
//     }
// }

// export const ROUTES: Route = {
//     login: {
//         link: 'login',
//         component: Login
//     },
//     signup: {
//         link: 'signup',
//         component: SignUp
//     }
// }