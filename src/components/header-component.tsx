import { StandardProperties } from 'csstype';
import logo from './../assets/logo.svg';
import { withFirebase } from '../providers/firebase-provider';
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
import { LinearProgress } from '@material-ui/core';
import { DialogInterface } from '../interfaces';
import { DialogComponent } from './dialog-component';

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

export const progress: {
    _showProgressBar: boolean;
    showProgressBar: Function;
    hideProgressBar: Function;
} = { _showProgressBar: false } as any;

const dialogOptions: DialogInterface = {
    title: '',
    text: '',
    isOpen: false,
    buttons: [],
    type: 'info'
}

export let dialog: {
    showMessageBox: typeof Header['prototype']['_showMessageBox']
} = {} as any;

class Header extends Component<basePropType> {

    constructor(props: basePropType) {
        super(props);
        this.state._showProgressBar = progress._showProgressBar;
        dialog.showMessageBox = this._showMessageBox.bind(this);
        this.init();
    }

    state: {
        _showProgressBar: boolean;
        dialogOptions: DialogInterface
    } = { _showProgressBar: false, dialogOptions }

    showProgressBar() {
        this.setState({ _showProgressBar: true });
    }

    hideProgressBar() {
        this.setState({ _showProgressBar: false });
    }

    currentOnResolve: Function = () => null;
    currentOnReject: Function = () => null;

    async _showMessageBox(title: string, text: string, buttons: string[], type: DialogInterface['type']) {
        return new Promise<number>((resolve, reject) => {
            dialogOptions.title = title;
            dialogOptions.text = text;
            dialogOptions.isOpen = true;
            dialogOptions.buttons = buttons;
            dialogOptions.type = type;
            this.setState({ dialogOptions });

            this.currentOnResolve = resolve;
            this.currentOnReject = reject;
        });
    }

    init() {
        progress.showProgressBar = this.showProgressBar.bind(this);
        progress.hideProgressBar = this.hideProgressBar.bind(this);
    }

    onClose(num?: number) {
        this.setState({ dialogOptions: { ...dialogOptions, isOpen: false } });

        if (this.currentOnResolve) {
            const resolveVal = typeof num == 'number' ? num : null;
            this.currentOnResolve(resolveVal);
        }
    }

    render() {
        const obj = { onClose: this.onClose.bind(this) };
        const options = Object.assign(this.state.dialogOptions, obj);
        return (
            <React.Fragment>
                <div style={MainContainerStyle}>
                    {this.state._showProgressBar && <LinearProgress style={{ position: 'absolute', width: '100%', top: '0px', height: '2px' }} />}
                    <div style={LeftHeaderStyle}>
                        <img src={logo} alt="logo" style={ImageStyles} />
                        <h3 style={{ margin: '0px 10px 0px 10px', verticalAlign: 'middle', fontSize: '1.3rem' }}>Dashboard</h3>
                    </div>
                    <div style={RightHeaderStyle}>
                    </div>
                </div>
                <DialogComponent {...options}></DialogComponent>
            </React.Fragment>
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
    justifyContent: 'space-between',
    position: 'relative'
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