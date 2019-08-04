import { basePropType } from "../basePropType";
import { ROUTES } from '../data/routes';
import HomeIcon from '@material-ui/icons/Home';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AppsIcon from '@material-ui/icons/Apps';

interface SidebarItems {
    label: string;
    icon?: any;
    private: boolean;
    clickRoute: string;
}

export function getSidebarItems(props: basePropType) {

    let path: string = ROUTES.PROJECTS_LIST_PAGE;
    if (props.firebase.auth.currentUser) {
        path = `${ROUTES.PROJECTS_LIST_PAGE}/${props.firebase.auth.currentUser.uid}`
    }

    const sidebarItems: SidebarItems[] = [
        {
            label: 'Dashboard',
            icon: HomeIcon,
            private: false,
            clickRoute: ROUTES.DASHBOARD_PAGE
        },
        {
            label: 'Account',
            icon: AccountBoxIcon,
            private: true,
            clickRoute: ROUTES.ACCOUNT_PAGE
        },
        {
            label: 'Projects',
            icon: AppsIcon,
            private: true,
            clickRoute: path
            // clickRoute: ''
        }
    ];
    return sidebarItems;
}