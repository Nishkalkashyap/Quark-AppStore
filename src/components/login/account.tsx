import React from 'react';
import { withFirebase } from '../../services/firebase/firebase.index';
import withAuthorization from './routeGuard';
import SignOutButton from './signout';
import { basePropType } from './signup';
import logo from './../../assets/logo.svg';
import { StandardProperties } from 'csstype';
import Typography from '@material-ui/core/Typography/Typography';
import { Divider, AppBar, Tabs, Tab, makeStyles } from '@material-ui/core';
import { default as MaterialLink } from '@material-ui/core/Link';
import { ROUTES } from '../../data/routes';
import { Link } from 'react-router-dom';

const AccountPage = (props: basePropType) => {
    const user = props.firebase.auth.currentUser as firebase.User;
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    function handleChange(event: any, newValue: any) {
        setValue(newValue);
    }


    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            <div style={SubContainer}>
                <div className="left-content" style={{ width: '22%' }}>
                    <img src={user.photoURL || logo} alt="user image" style={ImageStyle} />
                    <Typography variant="h5" style={{ fontWeight: 700 }}>
                        {user.displayName || 'Chuck Norris'}
                    </Typography>
                    <Divider style={{ margin: '10px 0px 30px 0px' }} />
                    <EditProfile></EditProfile>
                    <MaterialLink variant="body2" color="error" href="#" onClick={props.firebase.doSignOut} style={{ display: 'block' }}>
                        Sign Out
                    </MaterialLink>
                </div>
                <div className="right-content" style={{ width: '74%', marginLeft: '4%' }}>
                    <div className={classes.root}>
                        <AppBar position="static" style={AppBarStyles}>
                            <Tabs value={value} onChange={handleChange}>
                                <Tab label="Projects" />
                            </Tabs>
                        </AppBar>
                        {value === 0 && <TabContainer>Projects</TabContainer>}
                    </div>
                </div>
            </div>
        </div>
    )
};

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

function TabContainer(props: { children: React.ReactNode; }) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

const AppBarStyles: StandardProperties = {
    backgroundColor : 'transparent',
    color : '#000000',
    boxShadow : 'none',
    borderBottom : 'solid 1px var(--border-color)'
}

const SubContainer: StandardProperties = {
    maxWidth: '1140px',
    width: '90%',
    margin: '20px',
    display: 'flex'
}

const ImageStyle: StandardProperties = {
    // maxWidth: '250px',
    width: '100%',
    borderRadius: '5px',
    backgroundColor: 'rgba(0,0,0,0.12)',
    marginBottom: '15px'
}

const StupidTypescript = MaterialLink as any;
const EditProfile = () => (
    <StupidTypescript variant="body2" to={ROUTES.SIGN_UP} component={Link}>
        Edit Profile
    </StupidTypescript>
);

export default withAuthorization(withFirebase(AccountPage));