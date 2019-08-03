import React, { Component } from 'react'
import { PaginationComponent, Pagination, StateType } from '../components/pagination-component';
import { basePropType } from '../basePropType';
import { ReleaseItem } from '../interfaces';
import { getCollection_releases, getDocument_release } from '../data/paths';
import { ROUTES } from '../data/routes';
import queryString from 'query-string';
import { withAllProviders } from '../providers/all-providers';
import { ProjectCardComponent } from '../components/project-card-component';
import { CardActions, ButtonGroup, Button, Container, List } from '@material-ui/core';
import { ReleaseItemComponent } from '../components/release-item-component';

type PaginationType = ReleaseItem;

export class LocalComponent extends Component<basePropType> {
    firestore = this.props.firebase.firestore;

    pagination: Pagination<PaginationType> = {
        pagination: {
            getCollectionRef: () => { return this.firestore.collection(getCollection_releases(this.props.urlUserId!, this.props.urlProjectId!)) },
            getDocRef: () => { return this.firestore.doc(getDocument_release(this.props.urlUserId!, this.props.urlProjectId!, queryString.parse(this.props.history.location.search)['startAfter'] as string)) },
            getRedirectRoute: (params) => { return `${ROUTES.RELEASE_LIST_PAGE}/${this.props.urlUserId}/${params.projectId}?startAfter=${params.releaseId}` },
            loadLimit: 10,
            upperComponent: (data: { state: StateType<PaginationType> }) => (
                <ProjectCardComponent {...this.props} userId={this.props.urlUserId!} projectId={this.props.urlProjectId!}>
                    <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <ButtonGroup size="small" aria-label="small outlined button group" color="inherit">
                            <Button onClick={() => this.props.history.push(`${ROUTES.PROJECT_PAGE}/${this.props.urlUserId}/${this.props.urlProjectId}`)}>
                                Project home
                                </Button>
                        </ButtonGroup>
                    </CardActions>
                </ProjectCardComponent>
            ),
            iteratorComponent: (data: { state: StateType<PaginationType> }) => (
                <React.Fragment>
                    {data.state.paginationArray.map((release) => {
                        return (
                            <Container maxWidth="md" key={release.releaseId}>
                                <List style={{ marginTop: '30px' }}>
                                    <ReleaseItemComponent key={release.releaseId}  {...this.props} release={release} />
                                </List>
                            </Container>
                        )
                    })}
                </React.Fragment>
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

const ReleaseListPage = withAllProviders(LocalComponent);
export { ReleaseListPage }

