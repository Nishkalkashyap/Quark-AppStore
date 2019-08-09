import React, { Component } from 'react'
import { Container } from '@material-ui/core';
import { withAllProviders } from '../providers/all-providers';
import { basePropType } from '../basePropType';
import { MATCH_PARAMS, NEW_ROUTES } from '../data/routes';
import { getDocument_project, getDocument_release, getDocument_stats, getStorageRef_images, getCollection_releases } from '../data/paths';
import { handleFirebaseError, downloadFile, scrollToTop } from '../util';
import { ProjectData, ReleaseItem } from '../interfaces';
import { cloneDeep } from 'lodash';
import * as firebase from 'firebase';
import { dialog } from '../components/header-component';
import { AdditionalInformationComponent } from '../components/aditional-information-component';
import { ProjectCardComponent } from '../components/project-card-component';
import { ReleaseNotesComponent } from '../components/release-notes-component';
import { CrouselComponent } from '../components/crousel-component';
import { RatingsComponent } from '../components/ratings-component';

interface StateType {
    userId: string,
    projectId: string,
    latestRelease: ReleaseItem,
    releaseExists: boolean,
    nextExists: boolean,
    previousExists: boolean,
    goingBackwards: boolean,
    images: string[]
}


export default class LocalComponent extends Component<basePropType, Partial<StateType>> {
    INITIAL_STATE: StateType = {
        userId: '',
        projectId: '',
        latestRelease: {} as any,
        releaseExists: false,
        nextExists: false,
        previousExists: false,
        goingBackwards: false,
        images: []
    }

    constructor(props: basePropType) {
        super(props);
        this.state = cloneDeep(this.INITIAL_STATE);
        const userId = this.props.match.params[MATCH_PARAMS.USER_ID] || this.props.firebase.auth.currentUser!.uid;
        const projectId = this.props.match.params[MATCH_PARAMS.PROJECT_ID];

        this.state.userId = userId;
        this.state.projectId = projectId;
    }

    state: StateType = {} as any;

    listeners: Function[] = [];
    componentWillUnmount() { this.listeners.map((listener) => { listener() }) };
    componentDidMount() {
        this._setInitialState();
        this._setProjectData();
        scrollToTop('auto');
    }

    private _setInitialState() {

        this.props.firebase.storage.ref(getStorageRef_images(this.state.userId, this.state.projectId)).list()
            .then((list) => {
                const promises = list.items.map((item) => {
                    return item.getDownloadURL()
                });

                return Promise.all(promises);
            })
            .then((val) => {
                this.setState({ images: val });
            });
    }

    private _setProjectData() {
        // fetch latest release 
        const query = this.props.firebase.firestore.collection(getCollection_releases(this.state.userId, this.state.projectId))
            .orderBy('createdAt')
            .limit(1);

        this.listeners.push(
            this.props.firebase.getListenerForCollection(query, (snap) => {
                if (snap.docs.length && snap.docs[0].exists) {
                    this.setState({ releaseExists: true, latestRelease: snap.docs[0].data() as any })
                } else {
                    this.setState({ releaseExists: false });
                }
            })
        )
    }

    async showDeleteProjectDialog() {

        if (!this.props.isOwner) {
            return;
        }

        const self = this;
        const result = await dialog.showMessageBox<'Yes' | 'Cancel'>('Delete project', 'Are you sure you want to delete this project. This action is irreversible', ['Yes', 'Cancel'], 'question');
        if (result == 'Yes') {
            deleteRelease();
        }

        function deleteRelease() {
            self.props.firebase.firestore.doc(getDocument_project(self.state.userId, self.state.projectId))
                .delete()
                .then(() => {
                    self.props.enqueueSnackbar('Project deleted', { variant: 'success' });
                    self.props.history.push(NEW_ROUTES.PROJECTS_LIST_PAGE.base);
                })
                .catch(err => handleFirebaseError(self.props, err, 'Failed to delete project'))
        }
    }

    downloadFile(userId: string, projectId: string, releaseId: string, fileName: string) {
        this.props.firebase.storage.ref(`${getDocument_release(userId, projectId, releaseId)}/${fileName}`).getDownloadURL()
            .then((val) => {
                return downloadFile(val, fileName);
            })
            .then(() => {
                if (!this.props.isOwner) {
                    return this.props.firebase.firestore.doc(getDocument_stats(userId, projectId)).set(({
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
                    <ProjectCardComponent {...this.props} latestRelease={this.state.latestRelease} projectId={this.state.projectId} methods={{ showDeleteProjectDialog: this.showDeleteProjectDialog.bind(this) }} userId={this.state.userId} />
                    <CrouselComponent images={this.state.images} />
                    <RatingsComponent projectId={this.state.projectId} userId={this.state.userId} {...this.props} />
                    {this.state.releaseExists && <ReleaseNotesComponent notes={this.state.latestRelease.notes} style={{ margin: '100px 0px' }} {...this.props} />}
                    <AdditionalInformationComponent {...this.props} projectId={this.state.projectId} publisherId={this.state.userId} />
                </Container>
            </React.Fragment>
        )
    }
}

const ProjectLandingPage = withAllProviders(LocalComponent);
export { ProjectLandingPage }
