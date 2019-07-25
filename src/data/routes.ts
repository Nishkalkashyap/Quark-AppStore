// type allRoutes = 'login' | 'signup';

// type Route = {
//     [key :string]: string;
// }

export const ROUTES = {
    LANDING: '/',
    DASHBOARD: '/dashboard',
    SIGN_UP: '/signup',
    EditProfile: '/edit-profile',
    SIGN_IN: '/signin',
    PASSWORD_FORGET: '/forgot-password',
    ACCOUNT: '/account',
    Project: '/project',
    NewRelease: '/project',
}

export const SLUGS = {
    Project: ':userId/:projectId',
    NewRelease: ':userId/:projectId'
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