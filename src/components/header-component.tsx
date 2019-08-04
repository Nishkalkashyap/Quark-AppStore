import { StandardProperties } from 'csstype';
import { basePropType } from "../basePropType";
import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import NoteIcon from '@material-ui/icons/Note';
import { MessageDialogInterface, FormDialogInterface } from '../interfaces';
import { MessageDialogComponent } from './message-dialog-component';
import { FormDialogComponent } from './form-dialog-component';
import { ROUTES } from '../data/routes';
import { withAllProviders } from '../providers/all-providers';

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
            this.formOnResolve({ result: { button: formDialogOptions.buttons[resolveVal], text } });
        }
    }

    render() {
        const messageOptions = Object.assign(this.state.messageDialogOptions, { onClose: this.onCloseMessageDialog.bind(this) });
        const formOptions = Object.assign(this.state.formDialogOptions, { onClose: this.onCloseFormDialog.bind(this) });
        return (
            <React.Fragment>
                <div style={MainContainerStyle}>
                    <div style={LeftHeaderStyle} onClick={() => this.props.history.push(ROUTES.LANDING_PAGE)}>
                        <Typography component="h3" id="appbar-title" color="primary" style={{ margin: '0px 10px 0px 10px', verticalAlign: 'middle', fontSize: '1.3rem' }}>
                            Quark
                        </Typography>
                    </div>
                    <div style={RightHeaderStyle}>
                        {this.props.children}
                    </div>
                    {this.state.messageDialogOptions.isOpen && <MessageDialogComponent {...messageOptions}></MessageDialogComponent>}
                    {this.state.formDialogOptions.isOpen && <FormDialogComponent {...formOptions}></FormDialogComponent>}
                </div>
            </React.Fragment>
        )
    }
}

export default withAllProviders(Header);

const MainContainerStyle: StandardProperties = {
    display: 'flex',
    flexGrow: 1,
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