import React, { Component } from 'react'
import { PaginationComponent, Pagination, StateType } from '../components/pagination-component';
import { basePropType } from '../basePropType';
import { ProjectData } from '../interfaces';
import { getProjectsCollectionPath, getProjectDocPath } from '../data/paths';
import { ROUTES } from '../data/routes';
import queryString from 'query-string';
import UserCardComponent from '../components/user-card-component';
import { SmallProjectCardComponent, smallProjectContainerStyles } from '../components/small-project-card-component';
import { withAllProviders } from '../providers/all-providers';

export class LocalComponent extends Component<basePropType> {
    firestore = this.props.firebase.firestore;

    pagination: Pagination<ProjectData> = {
        pagination: {
            getCollectionRef: () => { return this.firestore.collection(getProjectsCollectionPath(this.props.urlUserId || this.props.firebase.auth.currentUser!.uid)) },
            getDocRef: () => { return this.firestore.doc(getProjectDocPath(this.props.urlProjectId || this.props.firebase.auth.currentUser!.uid, queryString.parse(this.props.history.location.search)['startAfter'] as string)) },
            getRedirectRoute: (params) => { return `${ROUTES.PROJECTS_LIST_PAGE}/${this.props.urlUserId}/${this.props.urlProjectId}?startAfter=${params.projectId}` },
            loadLimit: 10,
            upperComponent: (data: { state: StateType<ProjectData> }) => (
                <UserCardComponent {...this.props} userId={this.props.urlUserId || this.props.firebase.auth.currentUser!.uid}></UserCardComponent>
            ),
            iteratorComponent: (data: { state: StateType<ProjectData> }) => (
                <div style={smallProjectContainerStyles}>
                    {data.state.paginationArray.map((arr) => {
                        return (
                            <SmallProjectCardComponent key={arr.projectId} {...this.props} projectData={arr} />
                        )
                    })}
                </div>
            )
        }
    }

    render() {
        return (
            <PaginationComponent
                {...this.props}
                {...this.pagination}
            />
        )
    }
}

const ProjectsListPage = withAllProviders(LocalComponent);
export { ProjectsListPage }

