import React from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from './firebase-provider';
import { basePropType } from "../basePropType";
import { MATCH_PARAMS } from '../data/routes';

export const withOriginalOwner = (Component: any) => {
    class WithAuthorization extends React.Component<basePropType> {

        constructor(props: basePropType) {
            super(props);
            this.state = {
                userID: props.match.params[MATCH_PARAMS.USER_ID]
            }
        }

        state: {
            userID: string
        }

        render() {
            if (this.props.firebase.auth.currentUser!.uid == this.state.userID) {
                return (
                    <Component {...this.props} />
                );
            } else {
                return (
                    <div>
                        Only owner can change this project
                    </div>
                );
            }
        }
    }

    return ((WithAuthorization));
};