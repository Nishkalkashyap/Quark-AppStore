import React, { Component } from 'react'
import { Container } from '@material-ui/core';
import { withAllProviders } from '../providers/all-providers';
import { basePropType } from '../basePropType';
import { URL_KEYS } from '../data/routes';
import queryString from 'query-string';

// // import React, { Component } from 'react'

// export default class LocalComponent extends Component {
//     constructor(props: basePropType) {
//         super(props);
//         console.log(props.location.search);
//     }
//     render() {
//         return (
//             <Container maxWidth="md">
//                 <div></div>
//             </Container>
//         )
//     }
// }


function LocalComponent(props: basePropType) {

    const values = queryString.parse(props.location.search);
    const userId = props.match.params[URL_KEYS.USER_ID] || props.firebase.auth.currentUser!.uid;
    const startAt = values['startAt'] || null;

    return (
        <Container maxWidth="md">
            <div></div>
        </Container>
    )
}

const ProjectsListPage = withAllProviders(LocalComponent);
export { ProjectsListPage }
