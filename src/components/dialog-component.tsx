import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Dialog, createMuiTheme, Theme } from "@material-ui/core";
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
                    return (
                        <React.Fragment key={action}>
                            <Button onClick={() => data.onClose(index)} autoFocus variant="outlined" >
                                {action}
                            </Button>
                        </React.Fragment>
                    )
                })}
            </DialogActions>
        </Dialog>
    )
}