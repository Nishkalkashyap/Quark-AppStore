import { basePropType } from "../basePropType";
import { NEW_ROUTES } from '../data/routes';
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

    let path: string = NEW_ROUTES.PROJECTS_LIST_PAGE.base;
    if (props.firebase.auth.currentUser) {
        path = `/${props.firebase.auth.currentUser.uid}/${NEW_ROUTES.PROJECTS_LIST_PAGE.base}`
    }

    const sidebarItems: SidebarItems[] = [
        {
            label: 'Dashboard',
            icon: HomeIcon,
            private: false,
            clickRoute: NEW_ROUTES.DASHBOARD_PAGE.base

        },
        {
            label: 'Account',
            icon: AccountBoxIcon,
            private: true,
            clickRoute: NEW_ROUTES.ACCOUNT_PAGE.base
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