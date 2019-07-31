import React from 'react';
import { basePropType } from "../basePropType";
import { MATCH_PARAMS } from '../data/routes';

export const withMatchParams = (Component: any) => {
    class WithAuthorization extends React.Component<basePropType> {

        constructor(props: basePropType) {
            super(props);
            const userId = this.props.match.params[MATCH_PARAMS.USER_ID];
            const projectId = this.props.match.params[MATCH_PARAMS.PROJECT_ID];
            this.state = { urlUserId: userId, urlProjectId: projectId };
        }

        state: {
            urlUserId: string;
            urlProjectId: string;
        }

        render() {
            return (
                <Component {...this.props} {...this.state} />
            )
        }
    }

    return ((WithAuthorization));
};