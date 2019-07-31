import React, { Component } from 'react'
import { Container, List, Button, ButtonGroup, CardActions, Card, Typography, Divider } from '@material-ui/core';
import { withAllProviders } from '../providers/all-providers';
import { basePropType } from '../basePropType';
import { MATCH_PARAMS, ROUTES } from '../data/routes';
import queryString from 'query-string';
import { getProjectDocPath, getProjectStatsDocPath, getProjectReviewsCollectionPath, getProjectReviewDocPath } from '../data/paths';
import { handleFirebaseError, scrollToTop } from '../util';
import { ProjectData, ProjectStats, ProjectReviewInterface } from '../interfaces';
import { cloneDeep } from 'lodash';
import * as firebase from 'firebase';
import { progress } from '../components/header-component';
import { ProjectCardComponent } from '../components/project-card-component';
import Rating from '@material-ui/lab/Rating';
import moment from 'moment';

interface StateType {
    reviews: ProjectReviewInterface[],
    userId: string,
    projectId: string,
    projectData: ProjectData,
    projectStats: ProjectStats,
    loadLimit: number,
    nextExists: boolean,
    previousExists: boolean,
    querySnapshot?: firebase.firestore.QuerySnapshot,
    goingBackwards: boolean,
    isOwner: boolean,
}


export default class LocalComponent extends Component<basePropType, Partial<StateType>> {
    INITIAL_STATE: StateType = {
        reviews: [],
        userId: '',
        projectId: '',
        projectData: {} as any,
        projectStats: {} as any,
        loadLimit: 3,
        nextExists: false,
        previousExists: false,
        goingBackwards: false,
        isOwner: false
    }

    constructor(props: basePropType) {
        super(props);
        this._setInitialState();
        this._setProjectData();
        this._setReviewArray();
    }

    state: StateType = {} as any;

    private _setReviewArray() {
        const values = queryString.parse(this.props.history.location.search);
        const startAfter = values['startAfter'];
        progress.showProgressBar();

        if (startAfter && typeof startAfter == 'string') {
            this.props.firebase.firestore.doc(getProjectReviewDocPath(this.state.userId, this.state.projectId, startAfter)).get()
                .then((snap) => {

                    if (!snap.exists) {
                        this.props.history.push(ROUTES.NOT_FOUND);
                    }

                    const StartType = this.state.goingBackwards ? 'asc' : 'desc';
                    return this.props.firebase.firestore.collection(getProjectReviewsCollectionPath(this.state.userId, this.state.projectId))
                        .orderBy('createdAt', StartType)
                        .startAfter(snap)
                        .limit(this.state.loadLimit)
                        .get();
                })
                .then((result) => {
                    if (result.docs.length === 0) {
                        this.props.history.push(ROUTES.NOT_FOUND);
                    }

                    const arr = result.docs.map((doc) => doc.data()) as ProjectReviewInterface[];
                    scrollToTop();
                    this.setState({ reviews: this.state.goingBackwards ? arr.reverse() : arr, querySnapshot: result });
                    this._fetchNextAndPreviousDocuments();
                    progress.hideProgressBar();
                })
                .catch((err) => handleFirebaseError(err, this.props, 'Could not fetch document'))
        } else {
            this.props.firebase.firestore.collection(getProjectReviewsCollectionPath(this.state.userId, this.state.projectId))
                .orderBy('createdAt', 'desc')
                .limit(this.state.loadLimit)
                .get()
                .then((result) => {
                    const arr = result.docs.map((doc) => doc.data()) as ProjectReviewInterface[];
                    scrollToTop();
                    this.setState({ reviews: arr, querySnapshot: result });
                    this._fetchNextAndPreviousDocuments();
                    progress.hideProgressBar();
                })
                .catch((err) => handleFirebaseError(err, this.props, 'Could not fetch document'))
        }
    }


    private _setInitialState() {
        const userId = this.props.match.params[MATCH_PARAMS.USER_ID] || this.props.firebase.auth.currentUser!.uid;
        const projectId = this.props.match.params[MATCH_PARAMS.PROJECT_ID];

        this.state = cloneDeep(this.INITIAL_STATE);
        this.state.userId = userId;
        this.state.projectId = projectId;

        this.props.firebase.auth.onAuthStateChanged((e) => {
            if (e) {
                this.setState({ isOwner: e.uid === userId });
            }
        });
    }

    private _setProjectData() {
        this.props.firebase.firestore.doc(getProjectDocPath(this.state.userId, this.state.projectId))
            .get()
            .then((snap) => {
                if (!snap.exists) {
                    this.props.history.push(ROUTES.NOT_FOUND);
                    return;
                }
                this.setState({ projectData: snap.data() as ProjectData });
            })
            .catch((err) => handleFirebaseError(err, this.props, 'Could not fetch project data'));

        this.props.firebase.firestore.doc(getProjectStatsDocPath(this.state.userId, this.state.projectId))
            .get()
            .then((snap) => {
                if (!snap.exists) {
                    return;
                }
                this.setState({ projectStats: snap.data() as ProjectStats });
            })
            .catch((err) => handleFirebaseError(err, this.props, 'Could not fetch project stats'));
    }

    private async _fetchNextAndPreviousDocuments() {

        if (!this.state.reviews.length) {
            const state: Partial<StateType> = {
                nextExists: false,
                previousExists: false
            }
            this.setState(state);
            return;
        }

        const reverse = this.state.goingBackwards;
        let snap = this.state.querySnapshot!.docs;
        if (reverse) {
            snap = snap.reverse();
        }

        const nextDoc = snap[this.state.reviews.length - 1];
        const prevDoc = snap[0];

        const next = this.props.firebase.firestore.collection(getProjectReviewsCollectionPath(this.state.userId, this.state.projectId)).orderBy('createdAt', 'desc').startAfter(nextDoc).limit(1).get();
        const prev = this.props.firebase.firestore.collection(getProjectReviewsCollectionPath(this.state.userId, this.state.projectId)).orderBy('createdAt', 'asc').startAfter(prevDoc).limit(1).get();

        const [nextExists, previousExists] = (await Promise.all([next, prev])).map((res) => (res.docs[0] && res.docs[0].exists));

        const state: Partial<StateType> = {
            nextExists,
            previousExists
        }

        this.setState(state);
    }

    goToNextPage() {
        const { userId, projectId, reviews: reviews } = this.state;
        if (reviews.length) {
            const index = reviews.length - 1;
            this.props.history.push(`${ROUTES.PROJECT_PAGE}/${userId}/${projectId}?startAfter=${reviews[index].userId}`);
            this.setState({ goingBackwards: false });
            this._setReviewArray();
        }
    }

    goToPreviousPage() {
        const { userId, projectId, reviews: reviews } = this.state;
        if (reviews.length) {
            const index = 0;
            this.props.history.push(`${ROUTES.PROJECT_PAGE}/${userId}/${projectId}?startAfter=${reviews[index].userId}`);
            this.setState({ goingBackwards: true });
            this._setReviewArray();
        }
    }

    render() {
        return (
            <React.Fragment>
                <Container maxWidth="lg">
                    <ProjectCardComponent {...this.props} projectData={this.state.projectData} projectStats={this.state.projectStats} userId={this.state.userId}>
                        <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <ButtonGroup size="small" aria-label="small outlined button group" color="inherit">
                                <Button onClick={() => this.props.history.push(`${ROUTES.PROJECT_PAGE}/${this.props.urlUserId}/${this.props.urlProjectId}`)}>
                                    Project home
                                </Button>
                            </ButtonGroup>
                        </CardActions>
                    </ProjectCardComponent>
                    <Container maxWidth="md">
                        <List style={{ marginTop: '30px' }}>
                            {
                                this.state.reviews.map((review) => {
                                    return (
                                        <Card style={{ padding: '20px' }} key={review.userId + review.content}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2">
                                                    {review.userId}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Created: {moment(review.createdAt.toDate().toISOString(), moment.ISO_8601).fromNow()}
                                                </Typography>
                                            </div>
                                            <Divider style={{ margin: '10px 0px 10px 0px' }} />
                                            <Rating size="small" color="inherit" style={{ margin: '10px 0px' }} value={Number(review.rating) || 1} readOnly />
                                            <Typography variant="h5">
                                                {review.title}
                                            </Typography>
                                            <Typography variant="body2">
                                                {review.content}
                                            </Typography>
                                        </Card>
                                    )
                                })
                            }
                        </List>
                    </Container>
                </Container>
                <Container maxWidth="sm">
                    <ButtonGroup
                        fullWidth
                        color="primary"
                        size="small"
                        aria-label="large outlined secondary button group"
                    >
                        <Button onClick={this.goToPreviousPage.bind(this)} disabled={!this.state.previousExists}>
                            Previous
                        </Button>
                        <Button onClick={this.goToNextPage.bind(this)} disabled={!this.state.nextExists}>
                            Next
                        </Button>
                    </ButtonGroup>
                </Container>
            </React.Fragment>
        )
    }
}

const ReviewsListPage = withAllProviders(LocalComponent);
export { ReviewsListPage }
