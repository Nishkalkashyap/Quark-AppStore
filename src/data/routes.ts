export const MATCH_PARAMS = {
    USER_ID: 'userId',
    PROJECT_ID: 'projectId'
}

export const NEW_ROUTES = {
    LANDING_PAGE: {
        base: '/'
    },
    DASHBOARD_PAGE: {
        base: '/dashboard'
    },
    SIGN_UP: {
        base: '/signup'
    },
    SIGN_IN: {
        base: '/signin'
    },
    EDIT_PROFILE_PAGE: {
        base: '/edit-profile'
    },
    CHANGE_PASSWORD_PAGE: {
        base: '/change-password'
    },
    PASSWORD_FORGET_PAGE: {
        base: '/forgot-password'
    },
    ACCOUNT_PAGE: {
        base: '/projects'
    },
    CREATE_NEW_PROJECT_PAGE: {
        base: '/new-project'
    },



    PROJECT_PAGE: {
        base: 'project',
        slug: `/:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`
    },
    EDIT_PROJECT_PAGE: {
        base: 'edit-project',
        slug: `/:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`
    },
    PROJECT_REVIEW_PAGE: {
        base: 'review',
        slug: `/:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`
    },
    CREATE_RELEASE: {
        base: 'create-release',
        slug: `/:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`,
    },
    PROJECTS_LIST_PAGE: {
        base: 'projects',
        slug: `/:${MATCH_PARAMS.USER_ID}`
    },
    REVIEW_LIST_PAGE: {
        base: 'reviews',
        slug: `/:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`,
    },
    RELEASE_LIST_PAGE: {
        base: 'releases',
        slug: `/:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`
    },
    REPORT_ABUSE_PAGE: {
        base: 'report-abuse',
        slug: `/:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`,
    },




    NOT_FOUND: {
        base: '/404'
    },
}

const ROUTES = {
    // LANDING_PAGE: '/',
    LANDING_PAGE: '/',
    DASHBOARD_PAGE: '/dashboard',
    SIGN_UP: '/signup',
    SIGN_IN: '/signin',
    EDIT_PROFILE_PAGE: '/edit-profile',
    CHANGE_PASSWORD_PAGE: '/change-password',
    PASSWORD_FORGET_PAGE: '/forgot-password',

    ACCOUNT_PAGE: '/projects',
    PROJECT_PAGE: '/project',
    PROJECTS_LIST_PAGE: '/projects',
    EDIT_PROJECT_PAGE: '/edit-project',
    NEW_RELEASE: '/project',
    CREATE_NEW_PROJECT_PAGE: '/new-project',
    NOT_FOUND: '/404',

    PROJECT_REVIEW_PAGE: '/review',
    RELEASE_LIST_PAGE: '/releases',
    REVIEW_LIST_PAGE: '/reviews',
    REPORT_ABUSE_PAGE: '/report-abuse',
}

const SLUGS = {
    Project: `:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`,
    NEW_RELEASE: `:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`,

    PROJECTS_LIST_PAGE: `:${MATCH_PARAMS.USER_ID}`,
    PROJECT_REVIEW_PAGE: `:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`,
    REPORT_ABUSE_PAGE: `:${MATCH_PARAMS.USER_ID}/:${MATCH_PARAMS.PROJECT_ID}`,
}

const POST_SLUG = {
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