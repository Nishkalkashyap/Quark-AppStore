import React, { Component } from 'react'
import { PaginationComponent, Pagination, StateType } from '../components/pagination-component';
import { basePropType } from '../basePropType';
import { ProjectReviewInterface } from '../interfaces';
import { getCollection_reviews, getDocument_review } from '../data/paths';
import { NEW_ROUTES } from '../data/routes';
import queryString from 'query-string';
import { withAllProviders } from '../providers/all-providers';
import { ProjectCardComponent } from '../components/project-card-component';
import { CardActions, ButtonGroup, Button, Container, List } from '@material-ui/core';
import ReviewItemComponent from '../components/review-item-component';

type PaginationType = ProjectReviewInterface;

export class LocalComponent extends Component<basePropType> {
    firestore = this.props.firebase.firestore;

    pagination: Pagination<PaginationType> = {
        pagination: {
            getCollectionRef: (goingBackwards) => {
                const ref = this.firestore.collection(getCollection_reviews(this.props.urlUserId!, this.props.urlProjectId!));
                const StartType = goingBackwards ? 'asc' : 'desc';
                return ref.orderBy('createdAt', StartType);
            },
            getDocRef: () => { return this.firestore.doc(getDocument_review(this.props.urlUserId!, this.props.urlProjectId!, queryString.parse(this.props.history.location.search)['startAfter'] as string)) },
            getRedirectRoute: (params) => { return `${NEW_ROUTES.REVIEW_LIST_PAGE.base}/${this.props.urlUserId}/${this.props.urlProjectId!}?startAfter=${params.userId}` },
            loadLimit: 3,
            upperComponent: (data: { state: StateType<PaginationType> }) => (
                <ProjectCardComponent {...this.props} projectId={this.props.urlProjectId!} userId={this.props.urlUserId!}>
                    <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <ButtonGroup size="small" aria-label="small outlined button group" color="inherit">
                            <Button onClick={() => this.props.history.push(`/${this.props.urlUserId}/${this.props.urlProjectId}/${NEW_ROUTES.PROJECT_PAGE.base}`)}>
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

