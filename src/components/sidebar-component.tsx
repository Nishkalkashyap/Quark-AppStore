import React, { Component } from 'react'
import { StandardProperties } from 'csstype';
import { basePropType } from "../basePropType";
import { Firebase } from '../providers/firebase-provider';
import { ROUTES } from '../data/routes';
import { makeStyles, IconButton, Tooltip } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AppsIcon from '@material-ui/icons/Apps';

interface SidebarItems {
    label: string;
    // icon?: JSX.Element;
    icon?: any;
    private: boolean;
    clickRoute: string;
}

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    button: {
        margin: theme.spacing(1)
    },
    avatar: {
        margin: theme.spacing(1),
        marginBottom : '20px',
        color: theme.palette.primary.main,
        backgroundColor: 'transparent'
    }
}));

const icons: SidebarItems[] = [
    {
        label: 'Dashboard',
        icon: DashboardIcon,
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
        clickRoute: ROUTES.PROJECTS_LIST_PAGE
    }
]
export default class Sidebar extends Component<basePropType> {

    constructor(props: basePropType) {
        super(props);
        this.props.firebase.auth.onAuthStateChanged((e) => {
            this.forceUpdate();
        });
    }


    render() {
        return (
            <SidebarElement firebase={this.props.firebase} props={this.props}></SidebarElement>
        )
    }
}

const SidebarElement = (obj: { firebase: Firebase, props: any }) => {
    const { firebase } = obj;
    const classes = useStyles();
    return (
        <div style={SidebarContainerStyle}>
            {icons.map((item) => {
                if (item.private && !firebase.auth.currentUser) {
                    return null;
                }

                return (
                    <Tooltip title={item.label} placement="right" key={item.label} onClick={() => {
                        if (item.clickRoute) {
                            (obj.props).history.push(item.clickRoute);
                        }
                    }}>
                        <IconButton className={classes.avatar}>
                            {<item.icon style={{fontSize : '30px'}}></item.icon>}
                        </IconButton>
                    </Tooltip>
                )
            })}
        </div>
    )
}

const SidebarContainerStyle: StandardProperties = {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    width: '70px',
    height: '100%',
    borderRight: `1px solid var(--border-color)`
}
