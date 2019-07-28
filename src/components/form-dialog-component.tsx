import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Dialog, TextField } from "@material-ui/core";
import { FormDialogInterface } from "../interfaces";
import React, { ChangeEvent } from 'react';

export const FormDialogComponent = (data: FormDialogInterface & { onClose: (num: number, text: string) => void }) => {

    let content = data.value;
    function onChange(e: ChangeEvent<HTMLInputElement>) {
        content = e.target.value;
    }

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
                    {data.subTitle}
                </DialogContentText>
            </DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label={data.fieldlabel}
                type="text"
                rows="4"
                fullWidth
                multiline
                onChange={onChange}
                value={content}
            />
            <DialogActions>
                {data.buttons.map((action, index) => {
                    return (
                        <React.Fragment key={action}>
                            <Button onClick={() => data.onClose(index, content)} autoFocus variant="outlined" >
                                {action}
                            </Button>
                        </React.Fragment>
                    )
                })}
            </DialogActions>
        </Dialog>
    )
}