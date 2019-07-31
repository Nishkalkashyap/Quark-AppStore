import React, { Component } from 'react'
import { Container, List, Button, ButtonGroup, CardActions } from '@material-ui/core';
import { withAllProviders } from '../providers/all-providers';
import { basePropType } from '../basePropType';
import { MATCH_PARAMS, ROUTES } from '../data/routes';
import queryString from 'query-string';
import { getReleaseListCollectionPath, getProjectDocPath, getProjectReleaseDocPath, getProjectStatsDocPath, getProjectStorageImagesPath } from '../data/paths';
import { handleFirebaseError, downloadFile, scrollToTop } from '../util';
import { ReleaseItem, ProjectData, ProjectStats } from '../interfaces';
import { cloneDeep } from 'lodash';
import * as firebase from 'firebase';
import { progress, dialog } from '../components/header-component';
import { ReleaseItemComponent } from '../components/release-item-component';
import { ProjectCardComponent } from '../components/project-card-component';

interface StateType {
    releases: ReleaseItem[],
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
    images: string[]
}


export default class LocalComponent extends Component<basePropType, Partial<StateType>> {
    INITIAL_STATE: StateType = {
        releases: [],
        userId: '',
        projectId: '',
        projectData: {} as any,
        projectStats: {} as any,
        loadLimit: 3,
        nextExists: false,
        previousExists: false,
        goingBackwards: false,
        isOwner: false,
        images: []
    }

    constructor(props: basePropType) {
        super(props);
        this._setInitialState();
        this._setProjectData();
        this._setReleaseArray();
    }

    state: StateType = {} as any;

    listeners: Function[] = [];
    componentWillUnmount() { this.listeners.map((listener) => { listener() }) };

    private _setReleaseArray() {
        const values = queryString.parse(this.props.history.location.search);
        const startAfter = values['startAfter'];
        progress.showProgressBar();

        if (startAfter && typeof startAfter == 'string') {
            this.props.firebase.firestore.doc(getProjectReleaseDocPath(this.state.userId, this.state.projectId, startAfter)).get()
                .then((snap) => {

                    if (!snap.exists) {
                        this.props.history.push(ROUTES.NOT_FOUND);
                    }

                    const StartType = this.state.goingBackwards ? 'asc' : 'desc';
                    return this.props.firebase.firestore.collection(getReleaseListCollectionPath(this.state.userId, this.state.projectId))
                        .orderBy('createdAt', StartType)
                        .startAfter(snap)
                        .limit(this.state.loadLimit)
                        .get();
                })
                .then((result) => {
                    if (result.docs.length === 0) {
                        this.props.history.push(ROUTES.NOT_FOUND);
                    }

                    const arr = result.docs.map((doc) => doc.data()) as ReleaseItem[];
                    scrollToTop();
                    this.setState({ releases: this.state.goingBackwards ? arr.reverse() : arr, querySnapshot: result });
                    this._fetchNextAndPreviousDocuments();
                    progress.hideProgressBar();
                })
                .catch((err) => handleFirebaseError(err, this.props, 'Could not fetch document'))
        } else {
            this.props.firebase.firestore.collection(getReleaseListCollectionPath(this.state.userId, this.state.projectId))
                .orderBy('createdAt', 'desc')
                .limit(this.state.loadLimit)
                .get()
                .then((result) => {
                    const arr = result.docs.map((doc) => doc.data()) as ReleaseItem[];
                    scrollToTop();
                    this.setState({ releases: arr, querySnapshot: result });
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

        this.props.firebase.storage.ref(getProjectStorageImagesPath(userId, projectId)).list()
            .then((list) => {
                const promises = list.items.map((item) => {
                    return item.getDownloadURL()
                });

                return Promise.all(promises);
            })
            .then((val) => {
                this.setState({ images: val });
            });

        this.props.firebase.auth.onAuthStateChanged((e) => {
            if (e) {
                this.setState({ isOwner: e.uid === userId });
            }
        });
    }

    private _setProjectData() {
        this.listeners.push(
            this.props.firebase.firestore.doc(getProjectDocPath(this.state.userId, this.state.projectId))
                .onSnapshot((snap) => {
                    if (!snap.exists) {
                        this.props.history.push(ROUTES.NOT_FOUND);
                        return;
                    }
                    this.setState({ projectData: snap.data() as ProjectData });
                }, (err) => handleFirebaseError(this.props, err, 'Could not fetch project data')))

        this.listeners.push(
            this.props.firebase.firestore.doc(getProjectStatsDocPath(this.state.userId, this.state.projectId))
                .onSnapshot((snap) => {
                    if (!snap.exists) {
                        return;
                    }
                    this.setState({ projectStats: snap.data() as ProjectStats });
                }, (err) => handleFirebaseError(this.props, err, 'Could not fetch project stats'))
        )
    }

    private async _fetchNextAndPreviousDocuments() {

        if (!this.state.releases.length) {
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

        const nextDoc = snap[this.state.releases.length - 1];
        const prevDoc = snap[0];

        const next = this.props.firebase.firestore.collection(getReleaseListCollectionPath(this.state.userId, this.state.projectId)).orderBy('createdAt', 'desc').startAfter(nextDoc).limit(1).get();
        const prev = this.props.firebase.firestore.collection(getReleaseListCollectionPath(this.state.userId, this.state.projectId)).orderBy('createdAt', 'asc').startAfter(prevDoc).limit(1).get();

        const [nextExists, previousExists] = (await Promise.all([next, prev])).map((res) => (res.docs[0] && res.docs[0].exists));

        const state: Partial<StateType> = {
            nextExists,
            previousExists
        }

        this.setState(state);
    }

    async showEditReleaseDialog(userId: string, projectId: string, releaseId: string, notes: string) {

        if (!this.state.isOwner) {
            return;
        }

        const self = this;
        const result = await dialog.showFormDialog<'Yes' | 'Cancel'>('Delete release', 'Are you sure you want to delete this release. This action is irreversible', 'Notes', ['Yes', 'Cancel'], notes);
        if (result.result.button == 'Yes') {
            editRelease(result.result.text);
        }

        function editRelease(updatedNotes: string) {
            const findIndex = self.state.releases.findIndex((rel) => rel.releaseId == releaseId);
            if (findIndex !== -1) {
                self.props.firebase.firestore.doc(getProjectReleaseDocPath(userId, projectId, releaseId)).update({
                    notes: updatedNotes
                }).then(() => {
                    self.state.releases[findIndex].notes = updatedNotes;
                    self.setState({ releases: self.state.releases });
                    self.props.enqueueSnackbar('Release updated', { variant: 'success' });
                }).catch((err) => handleFirebaseError(self.props, err, 'Failed to delete release'));
            }
        }
    }

    async showDeleteReleaseDialog(userId: string, projectId: string, releaseId: string) {

        if (!this.state.isOwner) {
            return;
        }

        const self = this;
        const result = await dialog.showMessageBox<'Yes' | 'Cancel'>('Delete release', 'Are you sure you want to delete this release. This action is irreversible', ['Yes', 'Cancel'], 'warning');
        if (result == 'Yes') {
            deleteRelease();
        }

        function deleteRelease() {
            const findIndex = self.state.releases.findIndex((rel) => rel.releaseId == releaseId);
            if (findIndex !== -1) {
                self.props.firebase.firestore.doc(getProjectReleaseDocPath(userId, projectId, releaseId)).delete().then(() => {
                    self.state.releases.splice(findIndex, 1);
                    self.setState({ releases: self.state.releases });
                    self.props.enqueueSnackbar('Release deleted', { variant: 'success' });
                }).catch((err) => handleFirebaseError(self.props, err, 'Failed to delete release'));
            }
        }
    }

    goToNextPage() {
        const { userId, projectId, releases } = this.state;
        if (releases.length) {
            const index = releases.length - 1;
            this.props.history.push(`${ROUTES.PROJECT_PAGE}/${userId}/${projectId}?startAfter=${releases[index].releaseId}`);
            this.setState({ goingBackwards: false });
            this._setReleaseArray();
        }
    }

    goToPreviousPage() {
        const { userId, projectId, releases } = this.state;
        if (releases.length) {
            const index = 0;
            this.props.history.push(`${ROUTES.PROJECT_PAGE}/${userId}/${projectId}?startAfter=${releases[index].releaseId}`);
            this.setState({ goingBackwards: true });
            this._setReleaseArray();
        }
    }

    downloadFile(userId: string, projectId: string, releaseId: string, fileName: string) {
        this.props.firebase.storage.ref(`${getProjectReleaseDocPath(userId, projectId, releaseId)}/${fileName}`).getDownloadURL()
            .then((val) => {
                return downloadFile(val, fileName);
            })
            .then(() => {
                if (!this.state.isOwner) {
                    return this.props.firebase.firestore.doc(getProjectStatsDocPath(userId, projectId)).set(({
                        numberOfDownloads: firebase.firestore.FieldValue.increment(1) as any
                    } as Partial<ProjectData>), { merge: true });
                }
            })
            .catch(err => handleFirebaseError(err, this.props, 'Failed to fetch download url'));
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
                                this.state.releases.map((release) => {
                                    return (
                                        <ReleaseItemComponent key={release.releaseId}  {...this.props} release={release} methods={{ showEditReleaseDialog: this.showEditReleaseDialog.bind(this), showDeleteReleaseDialog: this.showDeleteReleaseDialog.bind(this) }} />
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
