import React, { Component } from 'react'
import { Container, List, Button, ButtonGroup, CardActions } from '@material-ui/core';
import { withAllProviders } from '../providers/all-providers';
import { basePropType } from '../basePropType';
import { ROUTES } from '../data/routes';
import queryString from 'query-string';
import { getProjectDocPath, getProjectStatsDocPath, getReleaseListCollectionPath, getProjectReleaseDocPath } from '../data/paths';
import { handleFirebaseError, scrollToTop } from '../util';
import { ReleaseItem, ProjectData, ProjectStats } from '../interfaces';
import * as firebase from 'firebase';
import { progress } from '../components/header-component';
import { ReleaseItemComponent } from '../components/release-item-component';
import { ProjectCardComponent } from '../components/project-card-component';

interface StateType {
    paginationArray: ReleaseItem[],
    projectData: ProjectData,
    projectStats: ProjectStats,
    loadLimit: number,
    nextExists: boolean,
    previousExists: boolean,
    querySnapshot?: firebase.firestore.QuerySnapshot,
    goingBackwards: boolean,
}


export default class LocalComponent extends Component<basePropType, Partial<StateType>> {

    getPaginationCollection = getReleaseListCollectionPath;
    getPaginationDocument = getProjectReleaseDocPath;
    redirectRoute = ROUTES.RELEASE_LIST_PAGE;

    constructor(props: basePropType) {
        super(props);
        this._setProjectData();
        this._setPaginationArray();
    }

    // only this could be different
    private _setProjectData() {
        this.listeners.push(
            this.props.firebase.firestore.doc(getProjectDocPath(this.props.urlUserId!, this.props.urlProjectId!))
                .onSnapshot((snap) => {
                    if (!snap.exists) {
                        this.props.history.push(ROUTES.NOT_FOUND);
                        return;
                    }
                    this.setState({ projectData: snap.data() as ProjectData });
                }, (err) => handleFirebaseError(this.props, err, 'Could not fetch project data')))

        this.listeners.push(
            this.props.firebase.firestore.doc(getProjectStatsDocPath(this.props.urlUserId!, this.props.urlProjectId!))
                .onSnapshot((snap) => {
                    if (!snap.exists) {
                        return;
                    }
                    this.setState({ projectStats: snap.data() as ProjectStats });
                }, (err) => handleFirebaseError(this.props, err, 'Could not fetch project stats'))
        )
    }

    state: StateType = {
        paginationArray: [],
        projectData: {} as any,
        projectStats: {} as any,
        loadLimit: 3,
        nextExists: false,
        previousExists: false,
        goingBackwards: false,
    }

    listeners: Function[] = [];
    paginationListeners: Function[] = [];
    componentWillUnmount() {
        this.listeners.map((listener) => { listener() });
        this.paginationListeners.map((listener) => { listener() });
    };

    private _setPaginationArray() {
        this.paginationListeners.map((listener) => { listener() });//clear releaseListeners

        const values = queryString.parse(this.props.history.location.search);
        const startAfter = values['startAfter'];
        progress.showProgressBar();

        if (startAfter && typeof startAfter == 'string') {
            const topListener = this.props.firebase.firestore
                .doc(this.getPaginationDocument(this.props.urlUserId!, this.props.urlProjectId!, startAfter))
                .onSnapshot((snap) => {

                    if (!snap.exists) {
                        this.props.history.push(ROUTES.NOT_FOUND);
                    }

                    const StartType = this.state.goingBackwards ? 'asc' : 'desc';
                    const subListener = this.props.firebase.firestore
                        .collection(this.getPaginationCollection(this.props.urlUserId!, this.props.urlProjectId!))
                        .orderBy('createdAt', StartType)
                        .startAfter(snap)
                        .limit(this.state.loadLimit)
                        .onSnapshot((subSnap) => {

                            if (subSnap.docs.length === 0) {
                                this.props.history.push(ROUTES.NOT_FOUND);
                            }

                            const arr = subSnap.docs.map((doc) => doc.data()) as ReleaseItem[];
                            scrollToTop();
                            this.setState({ paginationArray: this.state.goingBackwards ? arr.reverse() : arr, querySnapshot: subSnap });
                            this._fetchNextAndPreviousDocuments();
                            progress.hideProgressBar();
                        });

                    this.paginationListeners.push(subListener);

                }, ((err) => handleFirebaseError(this.props, err, 'Could not fetch document')));

            this.paginationListeners.push(topListener);
        } else {
            this.paginationListeners.push(
                this.props.firebase.firestore.collection(this.getPaginationCollection(this.props.urlUserId!, this.props.urlProjectId!))
                    .orderBy('createdAt', 'desc')
                    .limit(this.state.loadLimit)
                    .onSnapshot((snap) => {
                        const arr = snap.docs.map((doc) => doc.data()) as ReleaseItem[];
                        scrollToTop();
                        this.setState({ paginationArray: arr, querySnapshot: snap });
                        this._fetchNextAndPreviousDocuments();
                        progress.hideProgressBar();
                    }, (err) => handleFirebaseError(this.props, err, 'Could not fetch document'))
            );
        }
    }

    private async _fetchNextAndPreviousDocuments() {

        if (!this.state.paginationArray.length) {
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

        const nextDoc = snap[this.state.paginationArray.length - 1];
        const prevDoc = snap[0];

        const subs1 = (this.props.firebase.firestore.collection(this.getPaginationCollection(this.props.urlUserId!, this.props.urlProjectId!)).orderBy('createdAt', 'desc').startAfter(nextDoc).limit(1).onSnapshot((snap) => {
            const nextExists = snap.docs[0] && snap.docs[0].exists;
            this.setState({ nextExists });
            subs1();
        }));

        const subs2 = (this.props.firebase.firestore.collection(this.getPaginationCollection(this.props.urlUserId!, this.props.urlProjectId!)).orderBy('createdAt', 'asc').startAfter(prevDoc).limit(1).onSnapshot((snap) => {
            const previousExists = snap.docs[0] && snap.docs[0].exists;
            this.setState({ previousExists });
            subs2();
        }));

    }

    goToNextPage() {
        const { paginationArray } = this.state;
        if (paginationArray.length) {
            const index = paginationArray.length - 1;
            this.props.history.push(`${this.redirectRoute}/${this.props.urlUserId}/${this.props.urlProjectId}?startAfter=${paginationArray[index].releaseId}`);
            this.setState({ goingBackwards: false });
            this._setPaginationArray();
        }
    }

    goToPreviousPage() {
        const { paginationArray } = this.state;
        if (paginationArray.length) {
            const index = 0;
            this.props.history.push(`${this.redirectRoute}/${this.props.urlUserId}/${this.props.urlProjectId}?startAfter=${paginationArray[index].releaseId}`);
            this.setState({ goingBackwards: true });
            this._setPaginationArray();
        }
    }

    render() {
        return (
            <React.Fragment>
                <Container maxWidth="lg">
                    <ProjectCardComponent {...this.props} projectData={this.state.projectData} projectStats={this.state.projectStats} userId={this.props.urlUserId!}>
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
                                this.state.paginationArray.map((release) => {
                                    return (
                                        <ReleaseItemComponent key={release.releaseId}  {...this.props} release={release} />
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

const ReleaseListPage = withAllProviders(LocalComponent);
export { ReleaseListPage }
