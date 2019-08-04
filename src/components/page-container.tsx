import React, { useEffect } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HeaderComponent, { progress } from './header-component';
import { basePropType } from '../basePropType';
import { getSidebarItems } from './sidebar-component';
import { LinearProgress, Button } from '@material-ui/core';
import { ROUTES } from '../data/routes';
import { HeaderAvatarComponent } from './header-avatar-component';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../util';
import { SwagBackgroundComponent } from './swag-background-component';

const drawerWidth = 240;

const sidebarData = {
    backgroundColor: PRIMARY_COLOR,
    color: '#e8e9ea'
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            position: 'relative'
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        menuButton: {
            marginRight: 36,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            [theme.breakpoints.down('sm')]: {
                position: 'absolute'
            },
        },
        drawerOpen: {
            width: drawerWidth,
            [theme.breakpoints.down('sm')]: {
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                })
            },
        },
        drawerClose: {
            [theme.breakpoints.down('sm')]: {
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                })
            },
            overflowX: 'hidden',
            width: theme.spacing(0) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1,
            },
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 8px',
            ...theme.mixins.toolbar,
        },
        content: {
            flexGrow: 1,
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(5),
        },
    }),
);

export function PageContainer(props: basePropType & { children: any }) {

    useEffect(() => {
        const listener1 = props.history.listen((location, action) => {
            // console.log(location, action);
        });

        const listener2 = props.firebase.auth.onAuthStateChanged((e) => {
            if (e) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        });

        return () => { listener1(); listener2() };
    });

    const initial = progress._showProgressBar;
    progress.showProgressBar = showProgressBar;
    progress.hideProgressBar = hideProgressBar;

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [_showProgressBar, setShowProgressBar] = React.useState(initial);

    const childrenWithProps = React.Children.map(props.children, child =>
        React.cloneElement(child, { ...props })
    );

    function handleDrawerOpen() {
        if (open) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }

    function handleDrawerClose() {
        setOpen(false);
    }


    function showProgressBar() {
        setShowProgressBar(true);
    }

    function hideProgressBar() {
        setShowProgressBar(false);
    }

    const sidebarItems = getSidebarItems(props);

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                color="primary"
                elevation={0}
                className={clsx(classes.appBar)}
                style={{ backgroundColor: 'var(--bg-color)', color: '#333333', borderBottom: 'solid 1px var(--border-color)', boxShadow: `0 4px 12px 0 rgba(0, 0, 0, 0.05)` }}
            >
                {_showProgressBar && <LinearProgress style={{ position: 'absolute', width: '100%', top: '0px', height: '2px' }} />}
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton)}
                    >
                        {open ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                    <HeaderComponent>
                        <Button variant="contained" size="small" color="primary" style={{ boxShadow: 'none' }} onClick={() => window.open('https://quarkjs.io')}>
                            Go to docs
                        </Button>
                        {!isAuthenticated && <Button color="inherit" onClick={() => props.history.push(ROUTES.SIGN_IN)}>Login</Button>}
                        {isAuthenticated && <HeaderAvatarComponent {...props} />}
                    </HeaderComponent>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}

                open={open}
            >
                <div style={{ background: sidebarData.backgroundColor, height: '100%' }}>
                    <div className={classes.toolbar} style={{ justifyContent: 'space-between' }}>
                        {/* <Typography component="h3" color="inherit" style={{ marginLeft: '20px' }}>
                            Quark
                        </Typography> */}
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List style={{ color: sidebarData.color }}>
                        {sidebarItems.map((item, index) => (
                            <ListItem button key={item.label} disableRipple={true} onClick={() => {
                                if (item.clickRoute) {
                                    (props).history.push(item.clickRoute);
                                }
                            }}>
                                <ListItemIcon>
                                    <item.icon style={{ color: sidebarData.color }} />
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
            <main className={classes.content} style={{ position: 'relative' }}>
                {/* <MainBgComponent /> */}
                <SwagBackgroundComponent />
                <div className={classes.toolbar} />
                {childrenWithProps}
            </main>
        </div>
    );
}