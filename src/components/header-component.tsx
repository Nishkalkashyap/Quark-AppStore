import { StandardProperties } from 'csstype';
import logo from './../assets/logo.svg';
import { withFirebase } from './providers/firebase-provider';
import { basePropType } from "../basePropType";
import React, { Component } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import NoteIcon from '@material-ui/icons/Note';

const options = [
    {
        label: 'My Profile',
        icon: <PersonIcon />
    },
    {
        label: 'Dashboard',
        icon: <DashboardIcon />
    },
    {
        label: 'Documentation',
        icon: <NoteIcon />
    },
    {
        label: 'Sign out',
        icon: <ExitToAppIcon />
    }
]

const ITEM_HEIGHT = 48;

class Header extends Component<basePropType> {

    // constructor(props: basePropType) {
    //     super(props);
    // }

    render() {
        return (
            <div style={MainContainerStyle}>
                <div style={LeftHeaderStyle}>
                    <img src={logo} alt="logo" style={ImageStyles} />
                    <h3 style={{ margin: '0px 10px 0px 10px', verticalAlign: 'middle', fontSize: '1.3rem' }}>Dashboard</h3>
                </div>
                <div style={RightHeaderStyle}>
                    {/* {() => {
                        if (this.props.firebase.auth.currentUser) {
                            return <LongMenu ></LongMenu>
                        }
                        return <div />
                    }} */}
                </div>
            </div>
        )
    }
}

export default withFirebase(Header);

const MainContainerStyle: StandardProperties = {
    color: 'black',
    borderBottom: `1px solid var(--border-color)`,
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
}

const RightHeaderStyle: StandardProperties = {
    alignItems: 'center',
    display: 'flex'
}

const LeftHeaderStyle: StandardProperties = {
    alignItems: 'center',
    display: 'flex',
    cursor: 'pointer'
}

const ImageStyles: StandardProperties = {
    maxWidth: '35.2px',
    marginLeft: '24px',
}


function LongMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    function handleClick(event: any) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <div>
            <IconButton
                aria-label="More"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: 200,
                    },
                }}
            >
                {options.map(option => (
                    <MenuItem key={option.label} onClick={handleClose}>
                        {/* {option} */}
                        <ListItemIcon>
                            {option.icon}
                        </ListItemIcon>
                        <Typography variant="inherit">{option.label}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}