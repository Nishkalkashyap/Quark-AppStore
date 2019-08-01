import React from 'react';
import { basePropType } from "../basePropType";
import { MATCH_PARAMS, ROUTES } from '../data/routes';

export const withOriginalOwner = (Component: any) => {
    class WithAuthorization extends React.Component<basePropType> {

        constructor(props: basePropType) {
            super(props);
        }

        listener!: firebase.Unsubscribe;

        state = {
            isOwner: false
        }

        componentDidMount() {
            const userID = this.props.match.params[MATCH_PARAMS.USER_ID]
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                (authUser) => {
                    if (authUser!.uid !== userID) {
                        this.props.history.push(ROUTES.NOT_FOUND);
                        return;
                    } else {
                        this.setState({ isOwner: true })
                    }
                },
            );
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            if (this.state.isOwner) {
                return (
                    <Component {...this.props} />
                );
            } else {
                return (
                    <div>
                        Only owners can view this page.
                    </div>
                );
            }
        }
    }

    return ((WithAuthorization));
};