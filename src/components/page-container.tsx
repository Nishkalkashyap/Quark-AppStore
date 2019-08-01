import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme, createMuiTheme } from '@material-ui/core/styles';
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
import { sidebarItems } from './sidebar-component';
import { LinearProgress, Button, Typography } from '@material-ui/core';
import { ROUTES } from '../data/routes';
import { HeaderAvatarComponent } from './header-avatar-component';
import MainBgComponent from './main-background-component';
import { GradientBackground, PRIMARY_COLOR } from '../util';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: 36,
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
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
            padding: theme.spacing(3),
        },
    }),
);

export function PageContainer(props: basePropType & { children: any }) {

    const initial = progress._showProgressBar;
    progress.showProgressBar = showProgressBar;
    progress.hideProgressBar = hideProgressBar;

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [_showProgressBar, setShowProgressBar] = React.useState(initial);

    props.firebase.auth.onAuthStateChanged((e) => {
        if (e) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    });

    const childrenWithProps = React.Children.map(props.children, child =>
        React.cloneElement(child, { ...props })
    );

    function handleDrawerOpen() {
        setOpen(true);
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

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                color="primary"
                elevation={0}
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
                style={{ backgroundColor: 'var(--bg-color)', color: '#333333', borderBottom: 'solid 1px var(--border-color)' }}
            // style={{backgroundColor : '#100e17', color : PRIMARY_COLOR}}
            >
                {_showProgressBar && <LinearProgress style={{ position: 'absolute', width: '100%', top: '0px', height: '2px' }} />}
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <HeaderComponent>
                        <Button variant="outlined" size="small" color="inherit" onClick={() => window.open('https://quarkjs.io')}>
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
                <div style={{ background: '#ffffff', height: '100%' }}>
                    <div className={classes.toolbar} style={{ justifyContent: 'space-between' }}>
                        {/* <Typography component="h3" color="inherit" style={{ marginLeft: '20px' }}>
                            Quark
                        </Typography> */}
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        {sidebarItems.map((item, index) => (
                            <ListItem button key={item.label} onClick={() => {
                                if (item.clickRoute) {
                                    (props).history.push(item.clickRoute);
                                }
                            }}>
                                {/* <item.icon  style={{color : '#ffffff'}} /> */}
                                <ListItemIcon>
                                    <item.icon />
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
            <main className={classes.content} style={{ position: 'relative' }}>
                {/* <MainBgComponent /> */}
                <div className={classes.toolbar} />
                {childrenWithProps}
            </main>
        </div>
    );
}