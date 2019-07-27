import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Dialog } from "@material-ui/core";
import { DialogInterface } from "../interfaces";
import React from 'react';

export const DialogComponent = (data: DialogInterface & { onClose: Function }) => {
    return (
        <Dialog
            open={data.isOpen}
            onClose={data.onClose as any}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{data.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {data.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {data.buttons.map((action, index) => {
                    return (<Button key={action} onClick={() => data.onClose(index)} color="primary" autoFocus>
                        {action}
                    </Button>)
                })}
            </DialogActions>
        </Dialog>
    )
}