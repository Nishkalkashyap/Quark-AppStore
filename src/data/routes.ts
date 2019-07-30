// type allRoutes = 'login' | 'signup';

// type Route = {
//     [key :string]: string;
// }

export const ROUTES = {
    LANDING_PAGE: '/',
    DASHBOARD_PAGE: '/dashboard',
    SIGN_UP: '/signup',
    SIGN_IN: '/signin',
    EDIT_PROFILE_PAGE: '/edit-profile',
    CHANGE_PASSWORD_PAGE: '/change-password',
    PASSWORD_FORGET_PAGE: '/forgot-password',
    ACCOUNT_PAGE: '/account',
    PROJECT_PAGE: '/project',
    PROJECTS_LIST_PAGE: '/projects',
    EDIT_PROJECT_PAGE: '/edit-project',
    NEW_RELEASE: '/project',
    CREATE_NEW_PROJECT_PAGE: '/new-project',
    NOT_FOUND: '/404',

    PROJECT_REVIEW_PAGE: '/review',
}

export const MATCH_PARAMS = {
    USER_ID: 'userId',
    PROJECT_ID: 'projectId'
}

export const SLUGS = {
    Project: `:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`,
    NEW_RELEASE: `:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`,
    
    PROJECT_REVIEW_PAGE: `:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`,
}

export const POST_SLUG = {
    NEW_RELEASE: 'create-release'
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