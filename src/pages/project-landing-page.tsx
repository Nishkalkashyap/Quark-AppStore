import React, { Component } from 'react'
import { Container } from '@material-ui/core';
import { withAllProviders } from '../providers/all-providers';
import { basePropType } from '../basePropType';
import { MATCH_PARAMS, ROUTES } from '../data/routes';
import { getProjectDocPath, getProjectReleaseDocPath, getProjectStatsDocPath, getProjectStorageImagesPath } from '../data/paths';
import { handleFirebaseError, downloadFile } from '../util';
import { ProjectData, ProjectStats } from '../interfaces';
import { cloneDeep } from 'lodash';
import * as firebase from 'firebase';
import { dialog } from '../components/header-component';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { RatingsComponent } from '../components/ratings-component';
import { AdditionalInformationComponent } from '../components/aditional-information-component';
import { ProjectCardComponent } from '../components/project-card-component';

interface StateType {
    userId: string,
    projectId: string,
    projectData: ProjectData,
    projectStats: ProjectStats,
    loadLimit: number,
    nextExists: boolean,
    previousExists: boolean,
    querySnapshot?: firebase.firestore.QuerySnapshot,
    goingBackwards: boolean,
    images: string[]
}


export default class LocalComponent extends Component<basePropType, Partial<StateType>> {
    INITIAL_STATE: StateType = {
        userId: '',
        projectId: '',
        projectData: {} as any,
        projectStats: {} as any,
        loadLimit: 3,
        nextExists: false,
        previousExists: false,
        goingBackwards: false,
        images: []
    }

    constructor(props: basePropType) {
        super(props);
        this._setInitialState();
        this._setProjectData();
    }

    state: StateType = {} as any;

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
            self.props.firebase.firestore.doc(getProjectDocPath(self.state.userId, self.state.projectId))
                .delete()
                .then(() => {
                    self.props.enqueueSnackbar('Project deleted', { variant: 'success' });
                    self.props.history.push(ROUTES.PROJECTS_LIST_PAGE);
                })
                .catch(err => handleFirebaseError(self.props, err, 'Failed to delete project'))
        }
    }

    downloadFile(userId: string, projectId: string, releaseId: string, fileName: string) {
        this.props.firebase.storage.ref(`${getProjectReleaseDocPath(userId, projectId, releaseId)}/${fileName}`).getDownloadURL()
            .then((val) => {
                return downloadFile(val, fileName);
            })
            .then(() => {
                if (!this.props.isOwner) {
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
                    <ProjectCardComponent {...this.props} projectData={this.state.projectData} projectStats={this.state.projectStats} methods={{ showDeleteProjectDialog: this.showDeleteProjectDialog.bind(this) }} userId={this.state.userId} />
                    <AdditionalInformationComponent {...this.props} projectData={this.state.projectData} publisherId={this.state.userId} />
                    <RatingsComponent {...this.state.projectStats} />
                    <Container maxWidth="md" style={{ marginTop: '20px' }}>
                        <Carousel useKeyboardArrows autoPlay infiniteLoop >
                            {
                                this.state.images.map((img) => {
                                    return (
                                        <div key={img}>
                                            <img src={img} />
                                        </div>
                                    )
                                })
                            }
                        </Carousel>
                    </Container>
                </Container>
            </React.Fragment>
        )
    }
}

const ProjectLandingPage = withAllProviders(LocalComponent);
export { ProjectLandingPage }
