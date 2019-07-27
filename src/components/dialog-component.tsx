import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Dialog } from "@material-ui/core";
import { DialogInterface } from "../interfaces";

// const DialogComponent = (title: string, text: string, actions: { text: string, handle: Function }[], isOpen: boolean, handleClose: Function) => {
export const DialogComponent = (data: DialogInterface) => {
    return (
        <Dialog
            open={data.isOpen}
            onClose={data.handleClose as any}
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
                {data.actions.map((action) => {
                    <Button onClick={action.handle as any} color="primary" autoFocus>
                        Agree
                    </Button>
                })}
            </DialogActions>
        </Dialog>
    )
}

// {/* <Button onClick={handleClose} color="primary">
//                     Disagree
//                 </Button>
//                 <Button onClick={handleClose} color="primary" autoFocus>
//                     Agree
//                 </Button> */}