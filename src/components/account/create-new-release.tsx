import React, { Component } from 'react'
import { basePropType } from "../../basePropType";
import { Container } from '@material-ui/core';
import { withFirebase } from '../../services/firebase/firebase.index';
import withAuthorization from '../login/routeGuard';
import { withSnackbar } from 'notistack';

class LocalComponent extends Component<basePropType> {

    // constructor(props: basePropType) {
    //     super(props);
    // }

    render() {
        console.log(this.props);
        return (
            <Container component="main" maxWidth="md">
                New Release Component
            </Container>
        )
    }
}

export const CreateNewRelease = withFirebase(withAuthorization(withSnackbar(LocalComponent as any)));
