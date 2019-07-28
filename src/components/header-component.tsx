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
import { MessageDialogInterface, FormDialogInterface } from '../interfaces';
import { MessageDialogComponent } from './message-dialog-component';
import { FormDialogComponent } from './form-dialog-component';

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


export const progress: {
    _showProgressBar: boolean;
    showProgressBar: Function;
    hideProgressBar: Function;
} = { _showProgressBar: false } as any;

const messageDialogOptions: MessageDialogInterface = {
    title: '',
    text: '',
    isOpen: false,
    buttons: [],
    type: 'info'
}

const formDialogOptions: FormDialogInterface = {
    title: '',
    subTitle: '',
    value: '',
    isOpen: false,
    buttons: [],
    fieldlabel: 'Content'
}

export let dialog: {
    showMessageBox: typeof Header['prototype']['_showMessageBox'];
    showFormDialog: typeof Header['prototype']['_showFormDialog']
} = {} as any;

type FormResolveType<T> = { result: { button: T, text: string } };
class Header extends Component<basePropType> {

    constructor(props: basePropType) {
        super(props);

        dialog.showMessageBox = this._showMessageBox.bind(this);
        dialog.showFormDialog = this._showFormDialog.bind(this);
    }

    state: {
        messageDialogOptions: MessageDialogInterface,
        formDialogOptions: FormDialogInterface,
    } = { messageDialogOptions, formDialogOptions }

    messageOnResolve: <T = any>(text: T) => void = (t) => { }
    formOnResolve: <T = any>(res: FormResolveType<T>) => void = (t) => { }
    // messageOnResolve: Function = () => null;
    // formOnResolve: Function = () => null;

    async _showMessageBox<T = any>(title: string, text: string, buttons: T[], type: MessageDialogInterface['type']): Promise<T> {
        return new Promise<T>((resolve) => {
            messageDialogOptions.title = title;
            messageDialogOptions.text = text;
            messageDialogOptions.isOpen = true;
            messageDialogOptions.buttons = buttons;
            messageDialogOptions.type = type;
            this.setState({ messageDialogOptions });

            this.messageOnResolve = resolve as any;
        });
    }


    async _showFormDialog<T = any>(title: string, text: string, fieldlabel: string, buttons: T[], value?: string): Promise<FormResolveType<T>> {
        return new Promise<FormResolveType<T>>((resolve) => {
            formDialogOptions.title = title;
            formDialogOptions.subTitle = text;
            formDialogOptions.fieldlabel = fieldlabel;
            formDialogOptions.value = value || '';
            formDialogOptions.isOpen = true;
            formDialogOptions.buttons = buttons;
            this.setState({ formDialogOptions });

            this.formOnResolve = resolve as any;
        });
    }


    onCloseMessageDialog(num?: number) {
        this.setState({ messageDialogOptions: { ...messageDialogOptions, isOpen: false } });

        if (this.messageOnResolve) {
            const resolveVal = typeof num == 'number' ? num : 100000000;
            this.messageOnResolve(messageDialogOptions.buttons[resolveVal]);
        }
    }

    onCloseFormDialog(num: number, text: string) {
        this.setState({ formDialogOptions: { ...formDialogOptions, isOpen: false } });

        if (this.formOnResolve) {
            const resolveVal = typeof num == 'number' ? num : 100000000;
            // this.formOnResolve(formDialogOptions.buttons[resolveVal]);
            this.formOnResolve({ result: { button: formDialogOptions.buttons[resolveVal], text } });
        }
    }

    render() {
        const messageOptions = Object.assign(this.state.messageDialogOptions, { onClose: this.onCloseMessageDialog.bind(this) });
        const formOptions = Object.assign(this.state.formDialogOptions, { onClose: this.onCloseFormDialog.bind(this) });
        return (
            <React.Fragment>
                <div style={LeftHeaderStyle}>
                    <img src={logo} alt="logo" style={ImageStyles} />
                    <h3 style={{ margin: '0px 10px 0px 10px', verticalAlign: 'middle', fontSize: '1.3rem' }}>Dashboard</h3>
                </div>
                {this.state.messageDialogOptions.isOpen && <MessageDialogComponent {...messageOptions}></MessageDialogComponent>}
                {this.state.formDialogOptions.isOpen && <FormDialogComponent {...formOptions}></FormDialogComponent>}
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


const ITEM_HEIGHT = 48;
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