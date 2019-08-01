import React, { Component } from 'react'
import { PaginationComponent, Pagination, StateType } from '../components/pagination-component';
import { basePropType } from '../basePropType';
import { getProjectDocPath } from '../data/paths';
import { ROUTES } from '../data/routes';
import queryString from 'query-string';
import { SmallProjectCardComponent, smallProjectContainerStyles } from '../components/small-project-card-component';
import { withAllProviders } from '../providers/all-providers';
import { ProjectData } from '../interfaces';
import { AnimatedTextComponent } from '../components/animated-text-component';

type PaginationType = ProjectData;

export class LocalComponent extends Component<basePropType> {
    firestore = this.props.firebase.firestore;

    pagination: Pagination<PaginationType> = {
        pagination: {
            isGroupQuery: true,
            getCollectionRef: () => { return this.firestore.collectionGroup('projects') },
            getDocRef: () => { return this.firestore.doc(getProjectDocPath(this.props.urlProjectId || this.props.firebase.auth.currentUser!.uid, queryString.parse(this.props.history.location.search)['startAfter'] as string)) },
            getRedirectRoute: (params) => { return `${ROUTES.PROJECTS_LIST_PAGE}/${this.props.urlUserId}/${this.props.urlProjectId}?startAfter=${params.projectId}` },
            loadLimit: 3,
            upperComponent : ()=>{
                return (
                    <AnimatedTextComponent text={['Get', 'Set', 'Go!']}/>
                )
            },
            iteratorComponent: (data: { state: StateType<PaginationType> }) => (
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

const BrowseProjectsPage = withAllProviders(LocalComponent);
export { BrowseProjectsPage }

