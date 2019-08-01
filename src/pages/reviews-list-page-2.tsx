import React, { Component } from 'react'
import { PaginationComponent, Pagination, StateType } from '../components/pagination-component';
import { basePropType } from '../basePropType';
import { ProjectReviewInterface } from '../interfaces';
import { getProjectReviewsCollectionPath, getProjectReviewDocPath } from '../data/paths';
import { ROUTES } from '../data/routes';
import queryString from 'query-string';
import { withAllProviders } from '../providers/all-providers';
import { ProjectCardComponent } from '../components/project-card-component';
import { CardActions, ButtonGroup, Button, Container, List } from '@material-ui/core';
import ReviewItemComponent from '../components/review-item-component';

type PaginationType = ProjectReviewInterface;

export class LocalComponent extends Component<basePropType> {

    pagination: Pagination<PaginationType> = {
        pagination: {
            getCollectionPath: () => { return getProjectReviewsCollectionPath(this.props.urlUserId!, this.props.urlProjectId!) },
            getDocPath: () => { return getProjectReviewDocPath(this.props.urlUserId!, this.props.urlProjectId!, queryString.parse(this.props.history.location.search)['startAfter'] as string) },
            getRedirectRoute: (params) => { return `${ROUTES.PROJECT_PAGE}/${this.props.urlUserId}/${this.props.urlProjectId}?startAfter=${params.userId}` },
            loadLimit: 3,
            upperComponent: (data: { state: StateType<PaginationType> }) => (
                <ProjectCardComponent {...this.props} projectId={this.props.urlProjectId!} userId={this.props.urlUserId!}>
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
                <Container maxWidth="md">
                    <List style={{ marginTop: '30px' }}>
                        {
                            data.state.paginationArray.map((review) => {
                                return (
                                    <ReviewItemComponent key={review.userId} {...this.props} review={review} />
                                )
                            })
                        }
                    </List>
                </Container>
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

const ReviewsListPage = withAllProviders(LocalComponent);
export { ReviewsListPage }

