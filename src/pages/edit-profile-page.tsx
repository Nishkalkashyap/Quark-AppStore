import React, { Component } from 'react';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { getDocument_userData } from '../data/paths';
import { basePropType } from '../basePropType';
import { withAllProviders } from '../providers/all-providers';
import { ROUTES } from '../data/routes';
import { handleFirebaseError } from '../util';
import { UserProfileInterface, GenericFormData } from '../interfaces';
import GenericFormComponent from '../components/generic-form-component';


const EditProfilePage = () => <EditProfile />

const INITIAL_STATE: UserProfileInterface = {
    name: '',
    bio: '',
    location: '',
    site: '',

    githubUrl: '',
    twitterUrl: ''
};

class EditProfileBase extends Component<basePropType, UserProfileInterface> {
    constructor(props: basePropType) {
        super(props);
        this.state = { ...INITIAL_STATE };

        const name = this.props.firebase.auth.currentUser!.displayName;
        this.state.name = name || '';
    }

    listeners: Function[] = [];
    componentWillUnmount() { this.listeners.map((listener) => { listener() }) };

    componentWillMount() {
        const currentUser = this.props.firebase.auth.currentUser!;
        this.listeners.push(
            this.props.firebase.getListenerForDocument(this.props.firebase.firestore.doc(getDocument_userData(currentUser.uid)), (snap) => {
                const data = (snap.data() || {}) as any;
                Object.keys(data).map((key) => {
                    return this.setState({ [key]: data[key] })
                });
            })
        )
    }

    state: UserProfileInterface;

    onSubmit = (event: any) => {
        event.preventDefault();

        const currentUser = this.props.firebase.auth.currentUser!;
        const promises = [
            currentUser.updateProfile({
                displayName: this.state.name
            }),
            this.props.firebase.firestore.doc(getDocument_userData(currentUser.uid)).set({
                ...this.state
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
        site,
        githubUrl,
        twitterUrl
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
                type: "url",
                required: false,
                value: site || '',
            }
        },
        githubUrl: {
            formData: {
                label: "GitHub",
                type: "url",
                required: false,
                value: githubUrl || '',
            }
        },
        twitterUrl: {
            formData: {
                label: "Twitter",
                type: "url",
                required: false,
                value: twitterUrl || '',
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