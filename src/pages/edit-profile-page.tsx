import React, { Component } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { getDocument_userData } from '../data/paths';
import { basePropType } from '../basePropType';
import { useStyles } from '../components/common-components';
import { withAllProviders } from '../providers/all-providers';
import { TextField, Card } from '@material-ui/core';
import { ROUTES } from '../data/routes';
import { handleFirebaseError } from '../util';
import { UserProfileInterface, GenericFormData } from '../interfaces';
import GenericFormComponent from '../components/generic-form-component';


const EditProfilePage = () => <EditProfile />

const INITIAL_STATE: UserProfileInterface = {
    name: '',
    bio: '',
    location: '',
    site: ''
};

class EditProfileBase extends Component<basePropType> {
    constructor(props: basePropType) {
        super(props);
        this.state = { ...INITIAL_STATE };

        const name = this.props.firebase.auth.currentUser!.displayName;
        this.state.name = name || '';
    }

    listeners: Function[] = [];
    componentWillUnmount() { this.listeners.map((listener) => { listener() }) };

    componentDidMount() {
        const currentUser = this.props.firebase.auth.currentUser!;
        this.listeners.push(
            this.props.firebase.firestore.doc(getDocument_userData(currentUser.uid))
                .onSnapshot((snap) => {
                    const data = (snap.data() || {}) as any;
                    Object.keys(data).map((key) => {
                        return this.setState({ [key]: data[key] })
                    });
                }, (err) => handleFirebaseError(this.props, err, 'Failed to fetch profile'))
        )
    }

    state: typeof INITIAL_STATE;

    onSubmit = (event: any) => {
        event.preventDefault();
        
        const { name, bio, location, site } = this.state;

        const currentUser = this.props.firebase.auth.currentUser!;
        const promises = [
            currentUser.updateProfile({
                displayName: name
            }),
            this.props.firebase.firestore.doc(getDocument_userData(currentUser.uid)).set({
                name, bio, location, site
            })
        ];

        Promise.all(promises).then((val) => {
            this.props.enqueueSnackbar('Updated profile', { variant: 'success' });
            this.props.history.push(`${ROUTES.ACCOUNT_PAGE}`);
        }).catch((err) => {
            console.error(err);
            this.props.enqueueSnackbar('Failed to update profile', { variant: 'error' });
        });
    }

    onChange = (event: any) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <SignUpComponent onChange={this.onChange} onSubmit={this.onSubmit} state={this.state}></SignUpComponent>
        );
    }
}

const SignUpComponent = (props: { onSubmit: any, onChange: any, state: typeof INITIAL_STATE }) => {
    const {
        name,
        bio,
        location,
        site
    } = props.state;

    const data: GenericFormData['data'] = {
        name: {
            formData: {
                label: "Name",
                type: "text",
                required: false,
                value: name || ''
            }
        },
        bio: {
            formData: {
                label: "Bio",
                type: "text",
                required: false,
                value: bio || '',

                multiline: true,
                rows: '4'
            }
        },
        location: {
            formData: {
                label: "Location",
                type: "text",
                required: false,
                value: location || '',
            }
        },
        site: {
            formData: {
                label: "Site",
                type: "text",
                required: false,
                value: site || '',
            }
        }
    }

    return (
        <GenericFormComponent
            headingText="Edit Profile"
            icon={AccountBoxIcon}
            isInvalid={false}
            onChange={props.onChange}
            onSubmit={props.onSubmit}
            submitButtonText="Submit"
            data={data}
        />
    );
}

const EditProfile = withAllProviders(EditProfileBase);
export default (EditProfilePage);