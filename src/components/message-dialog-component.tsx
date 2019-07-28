import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Dialog } from "@material-ui/core";
import { MessageDialogInterface } from "../interfaces";
import React from 'react';
import { StandardProperties } from "csstype";

export const MessageDialogComponent = (data: MessageDialogInterface & { onClose: Function }) => {
    const color: 'medium' | 'danger' | 'secondary' | 'warning' = data.type === 'info' ? 'medium' : data.type === 'error' ? 'danger' : data.type === 'question' ? 'secondary' : 'warning';
    const style: StandardProperties = {
        borderLeft: `solid 3px var(--ion-color-${color})`
    }

    return (
        <Dialog
            open={data.isOpen}
            onClose={data.onClose as any}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" style={style}>{data.title}</DialogTitle>
            <DialogContent style={style}>
                <DialogContentText id="alert-dialog-description">
                    {data.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions style={style}>
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