import React, { Component } from 'react'
import { PaginationComponent, Pagination, StateType } from '../components/pagination-component';
import { basePropType } from '../basePropType';
import { ProjectData } from '../interfaces';
import { getCollection_projects, getDocument_project } from '../data/paths';
import { NEW_ROUTES } from '../data/routes';
import queryString from 'query-string';
import UserCardComponent from '../components/user-card-component';
import { SmallProjectCardComponent, smallProjectContainerStyles } from '../components/small-project-card-component';
import { withAllProviders } from '../providers/all-providers';

export class LocalComponent extends Component<basePropType> {
    firestore = this.props.firebase.firestore;

    pagination: Pagination<ProjectData> = {
        pagination: {
            getCollectionRef: (goingBackwards: boolean) => {
                const ref = this.firestore.collection(getCollection_projects(this.props.urlUserId || this.props.firebase.auth.currentUser!.uid));
                const StartType = goingBackwards ? 'asc' : 'desc';
                return ref.orderBy('createdAt', StartType);
            },
            getDocRef: () => { return this.firestore.doc(getDocument_project(this.props.urlProjectId || this.props.firebase.auth.currentUser!.uid, queryString.parse(this.props.history.location.search)['startAfter'] as string)) },
            getRedirectRoute: (params) => { return `${NEW_ROUTES.PROJECTS_LIST_PAGE.base}/${params.userId}?startAfter=${params.projectId}` },
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

