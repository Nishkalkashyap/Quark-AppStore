import React from 'react'
import { IconButton, Menu, MenuItem, Divider, ListItemText } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { basePropType } from '../basePropType';
import { ROUTES } from '../data/routes';
import { dialog, progress } from './header-component';

export function HeaderAvatarComponent(props: basePropType) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    function handleMenu(event: React.MouseEvent<HTMLElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }
    return (
        <div>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="primary"
            >
                <AccountCircle />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem dense={true} onClick={() => props.history.push(ROUTES.ACCOUNT_PAGE)}>
                    <ListItemText primary="My account" />
                </MenuItem>
                <MenuItem dense={true} onClick={() => props.history.push(ROUTES.EDIT_PROFILE_PAGE)}>
                    <ListItemText primary="Edit profile" />
                </MenuItem>
                <MenuItem dense={true} onClick={() => props.history.push(ROUTES.CHANGE_PASSWORD_PAGE)}>
                    <ListItemText primary="Change password" />
                </MenuItem>
                <Divider />
                <MenuItem dense={true} onClick={() => {
                    dialog.showFormDialog<'Submit' | 'Cancel'>('Submit feedback', 'What are yout thoughts?', '', ['Submit', 'Cancel'])
                        .then((val) => {
                            progress.showProgressBar();
                            if (val.result.button == 'Submit') {
                                props.firebase.callFeedbackFunction(val.result.text).then(() => {
                                    props.enqueueSnackbar('Feedback submitted', { variant: 'success' })
                                }).catch(() => {
                                    props.enqueueSnackbar('Failed to submit feedback', { variant: 'error' })
                                }).finally(() => {
                                    progress.hideProgressBar();
                                });
                            }
                        });
                }}>
                    <ListItemText primary="Submit Feedback" />
                </MenuItem>
                <Divider />
                <MenuItem dense={true} onClick={() => props.firebase.auth.signOut()}>
                    <ListItemText primary="Sign Out" />
                </MenuItem>
            </Menu>
        </div>
    )
}
