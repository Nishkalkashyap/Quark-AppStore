import React, { Component } from 'react'
import { Container, Button, ButtonGroup } from '@material-ui/core';
import { withAllProviders } from '../providers/all-providers';
import { basePropType } from '../basePropType';
import { ROUTES } from '../data/routes';
import queryString from 'query-string';
import { getProjectDocPath, getProjectsCollectionPath } from '../data/paths';
import { handleFirebaseError, scrollToTop } from '../util';
import { ProjectData } from '../interfaces';
import * as firebase from 'firebase';
import { progress } from '../components/header-component';
import { SmallProjectCardComponent } from '../components/small-project-card-component';
import UserCardComponent from '../components/user-card-component';

// replace this.props.urlUserId with (this.props.urlProjectId || this.props.firebase.auth.currentUser!.uid)

type PaginationType = ProjectData;
type extraState = {}

interface StateType extends extraState {
    paginationArray: PaginationType[],
    loadLimit: number,
    nextExists: boolean,
    previousExists: boolean,
    querySnapshot?: firebase.firestore.QuerySnapshot,
    goingBackwards: boolean,
}


export default class LocalComponent extends Component<basePropType, Partial<StateType>> {

    getPaginationCollection = getProjectsCollectionPath;
    getPaginationDocument = getProjectDocPath;
    redirectRoute = ROUTES.PROJECTS_LIST_PAGE;

    constructor(props: basePropType) {
        super(props);
        this._setPaginationArray();
    }

    state: StateType = {
        paginationArray: [],
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
                .doc(this.getPaginationDocument(this.props.urlProjectId || this.props.firebase.auth.currentUser!.uid, startAfter))
                .onSnapshot((snap) => {

                    if (!snap.exists) {
                        this.props.history.push(ROUTES.NOT_FOUND);
                    }

                    const StartType = this.state.goingBackwards ? 'asc' : 'desc';
                    const subListener = this.props.firebase.firestore
                        .collection(this.getPaginationCollection(this.props.urlProjectId || this.props.firebase.auth.currentUser!.uid))
                        .orderBy('createdAt', StartType)
                        .startAfter(snap)
                        .limit(this.state.loadLimit)
                        .onSnapshot((subSnap) => {

                            if (subSnap.docs.length === 0) {
                                this.props.history.push(ROUTES.NOT_FOUND);
                            }

                            const arr = subSnap.docs.map((doc) => doc.data()) as PaginationType[];
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
                this.props.firebase.firestore.collection(this.getPaginationCollection(this.props.urlProjectId || this.props.firebase.auth.currentUser!.uid))
                    .orderBy('createdAt', 'desc')
                    .limit(this.state.loadLimit)
                    .onSnapshot((snap) => {
                        const arr = snap.docs.map((doc) => doc.data()) as PaginationType[];
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

        const subs1 = (this.props.firebase.firestore.collection(this.getPaginationCollection(this.props.urlProjectId || this.props.firebase.auth.currentUser!.uid)).orderBy('createdAt', 'desc').startAfter(nextDoc).limit(1).onSnapshot((snap) => {
            const nextExists = snap.docs[0] && snap.docs[0].exists;
            this.setState({ nextExists });
            subs1();
        }));

        const subs2 = (this.props.firebase.firestore.collection(this.getPaginationCollection(this.props.urlProjectId || this.props.firebase.auth.currentUser!.uid)).orderBy('createdAt', 'asc').startAfter(prevDoc).limit(1).onSnapshot((snap) => {
            const previousExists = snap.docs[0] && snap.docs[0].exists;
            this.setState({ previousExists });
            subs2();
        }));

    }

    goToNextPage() {
        const { paginationArray } = this.state;
        if (paginationArray.length) {
            const index = paginationArray.length - 1;
            this.props.history.push(`${this.redirectRoute}/${this.props.urlUserId}/${this.props.urlProjectId}?startAfter=${paginationArray[index].projectId}`);
            this.setState({ goingBackwards: false });
            this._setPaginationArray();
        }
    }

    goToPreviousPage() {
        const { paginationArray } = this.state;
        if (paginationArray.length) {
            const index = 0;
            this.props.history.push(`${this.redirectRoute}/${this.props.urlUserId}/${this.props.urlProjectId}?startAfter=${paginationArray[index].projectId}`);
            this.setState({ goingBackwards: true });
            this._setPaginationArray();
        }
    }

    render() {
        return (
            <React.Fragment>
                <Container maxWidth="lg">
                    <UserCardComponent {...this.props} userId={this.props.urlUserId || this.props.firebase.auth.currentUser!.uid}></UserCardComponent>
                    <Container maxWidth="md">
                        {this.state.paginationArray.map((arr) => {
                            return (
                                <SmallProjectCardComponent key={arr.projectId} {...this.props} projectData={arr} />
                            )
                        })}
                    </Container>
                </Container>
                <Container maxWidth="sm" style={{ marginTop: '100px' }}>
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

const ProjectsListPage = withAllProviders(LocalComponent);
export { ProjectsListPage }
