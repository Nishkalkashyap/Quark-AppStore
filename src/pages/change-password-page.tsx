import React, { Component } from 'react';
import { basePropType } from "../basePropType";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { NEW_ROUTES } from '../data/routes';
import { useStyles } from '../components/common-components';
import { withAllProviders } from '../providers/all-providers';
import { GenericFormData } from '../interfaces';
import { title } from 'process';
import GenericFormComponent from '../components/generic-form-component';

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: {
        message: null
    },
};

class PasswordChangeForm extends Component<basePropType> {
    constructor(props: basePropType) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    state: typeof INITIAL_STATE;

    onSubmit = (event: any) => {
        const { passwordOne } = this.state;

        this.props.firebase
            .doPasswordUpdate(passwordOne)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.enqueueSnackbar('Password changed', { variant: 'success' });
                this.props.history.push(NEW_ROUTES.ACCOUNT_PAGE.base);
            })
            .catch(error => {
                this.setState({ error });
                this.props.enqueueSnackbar(error.message, { variant: 'error' });
            })

        event.preventDefault();
    };

    onChange = (event: any) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <PasswordChangeElement onChange={this.onChange} onSubmit={this.onSubmit} state={this.state}></PasswordChangeElement>
        );
    }
}

const PasswordChangeElement = (props: { onSubmit: any, onChange: any, state: typeof INITIAL_STATE }) => {
    const { passwordOne, passwordTwo } = props.state;
    const isInvalid = passwordOne !== passwordTwo || !passwordOne || !passwordTwo

    const data: GenericFormData['data'] = {
        passwordOne: {
            formData: {
                label: "New Password",
                type: "password",
                required: true,
                value: passwordOne,

                autoComplete: "password"
            }
        },
        passwordTwo: {
            formData: {
                label: "Confirm Password",
                type: "password",
                required: true,
                value: passwordTwo,

                autoComplete: "password"
            }
        }
    }

    return (
        <GenericFormComponent
            headingText="Change Password"
            icon={LockOutlinedIcon}
            isInvalid={isInvalid}
            onChange={props.onChange}
            onSubmit={props.onSubmit}
            submitButtonText="Submit"
            data={data}
        />
    );
}

export default withAllProviders(PasswordChangeForm);