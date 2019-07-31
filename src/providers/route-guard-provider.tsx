import React from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from './firebase-provider';
import { ROUTES, MATCH_PARAMS } from '../data/routes';
import { basePropType } from "../basePropType";

export const withAuthorization = (Component: any) => {
    class WithAuthorization extends React.Component<basePropType> {

        listener!: firebase.Unsubscribe;

        componentDidMount() {
            const userId = this.props.match.params[MATCH_PARAMS.USER_ID];
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                (authUser) => {
                    if (!authUser) {
                        this.setState({ isOwner: false });
                        this.props.history.push(ROUTES.SIGN_IN);
                        return;
                    }
                    this.setState({ isOwner: userId == authUser.uid });
                    this.forceUpdate();
                },
            );
        }

        state: {
            isOwner: boolean
        } = { isOwner: false }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            if (this.props.firebase.auth.currentUser) {
                return (
                    <Component {...this.props} {...this.state} />
                );
            } else {
                return (
                    <div></div>
                );
            }
        }
    }

    return withRouter(withFirebase(WithAuthorization));
};

export default withAuthorization;