import React from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from './../../services/firebase/firebase.index';
import { ROUTES } from '../../data/routes';
import { basePropType } from './signup';

// const condition = (authUser: firebase.User) => !!authUser;
export const withAuthorization = (Component: any) => {
    class WithAuthorization extends React.Component<basePropType> {

        listener!: firebase.Unsubscribe;

        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    if (!authUser) {
                        this.props.history.push(ROUTES.SIGN_IN);
                    }
                },
            );
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <Component {...this.props} />
            );
        }
    }

    return withRouter(withFirebase(WithAuthorization));

    // return compose(
    //     withRouter,
    //     withFirebase,
    // )(WithAuthorization);
};

export default withAuthorization;