import React, { Component } from 'react'
import { Container, List, Typography, Card, CardContent, Button, CardActions, Link, ButtonGroup, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withAllProviders } from '../providers/all-providers';
import { basePropType } from '../basePropType';
import { MATCH_PARAMS, ROUTES, POST_SLUG } from '../data/routes';
import queryString from 'query-string';
import { getReleaseListCollectionPath, getProjectPath, getProjectReleaseDocPath } from '../data/paths';
import { handleFirebaseError, downloadFile } from '../util';
import { ReleaseItem, ProjectData } from '../interfaces';
import { useStylesList } from './project-list-page';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import * as firebase from 'firebase';
import { progress, dialog } from '../components/header-component';

interface StateType {
    releases: ReleaseItem[],
    userId: string,
    projectId: string,
    projectData: ProjectData,
    loadLimit: number,
    nextExists: boolean,
    previousExists: boolean,
    querySnapshot?: firebase.firestore.QuerySnapshot,
    goingBackwards: boolean
}


export default class LocalComponent extends Component<basePropType> {
    INITIAL_STATE: StateType = {
        releases: [],
        userId: '',
        projectId: '',
        projectData: {} as any,
        loadLimit: 3,
        nextExists: false,
        previousExists: false,
        goingBackwards: false
    }

    constructor(props: basePropType) {
        super(props);
        this._setInitialState();
        this._setProjectData();
        this._setReleaseArray();
    }

    state: StateType = {} as any;

    private async _setReleaseArray() {
        const values = queryString.parse(this.props.history.location.search);
        const startAfter = values['startAfter'];
        progress.showProgressBar();

        if (startAfter && typeof startAfter == 'string') {
            this.props.firebase.firestore.doc(getProjectReleaseDocPath(this.state.userId, this.state.projectId, startAfter)).get()
                .then(async (snap) => {
                    if (snap.exists) {
                        const StartType = this.state.goingBackwards ? 'asc' : 'desc';

                        const query = this.props.firebase.firestore.collection(getReleaseListCollectionPath(this.state.userId, this.state.projectId)).orderBy('createdAt', StartType).startAfter(snap).limit(this.state.loadLimit);
                        const result = await query.get();
                        const arr = result.docs.map((doc) => doc.data());
                        this.setState({ releases: this.state.goingBackwards ? arr.reverse() : arr, querySnapshot: result });
                        this._fetchNextAndPreviousDocuments();
                        progress.hideProgressBar();

                        if (result.docs.length === 0) {
                            this.props.history.push(ROUTES.NOT_FOUND);
                        }
                        return;
                    }

                    this.props.history.push(ROUTES.NOT_FOUND);
                }).catch((err) => handleFirebaseError(err, this.props, 'Could not fetch document'))
        } else {
            const query = this.props.firebase.firestore.collection(getReleaseListCollectionPath(this.state.userId, this.state.projectId)).orderBy('createdAt', 'desc').limit(this.state.loadLimit);
            const result = await query.get();
            const arr = result.docs.map((doc) => doc.data());
            this.setState({ releases: arr, querySnapshot: result });
            this._fetchNextAndPreviousDocuments();
            progress.hideProgressBar();
        }
    }


    private _setInitialState() {
        const userId = this.props.match.params[MATCH_PARAMS.USER_ID] || this.props.firebase.auth.currentUser!.uid;
        const projectId = this.props.match.params[MATCH_PARAMS.PROJECT_ID];

        this.state = cloneDeep(this.INITIAL_STATE);
        this.state.userId = userId;
        this.state.projectId = projectId;
    }

    private _setProjectData() {

        this.props.firebase.firestore.doc(getProjectPath(this.state.userId, this.state.projectId)).get().then((snap) => {
            if (snap.exists) {
                this.setState({ projectData: snap.data() });
                return;
            }
            this.props.history.push(ROUTES.NOT_FOUND);
        }).catch((err) => handleFirebaseError(err, this.props, 'Could not fetch project data'));
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

    async showDeleteReleaseDialog() {
        const result = await dialog.showMessageBox('Delete release', 'Are you sure you want to delete this release. This action is irreversible', ['Yes', 'Cancel'], 'warning');
        console.log(result);
    }

    deleteRelease(userId: string, projectId: string, releaseId: string) {
        const findIndex = this.state.releases.findIndex((rel) => rel.releaseId == releaseId);
        if (findIndex !== -1) {
            this.state.releases.splice(findIndex, 1);
            this.setState({ releases: this.state.releases });

            this.props.firebase.firestore.doc(getProjectReleaseDocPath(userId, projectId, releaseId)).delete().then((rel) => {
                this.props.enqueueSnackbar('Release deleted');
            }).catch((err) => handleFirebaseError(this.props, err, 'Failed to delete release'));
        }
    }

    goToNextPage() {
        const { userId, projectId, releases } = this.state;
        if (releases.length) {
            const index = releases.length - 1;
            this.props.history.push(`${ROUTES.Project}/${userId}/${projectId}?startAfter=${releases[index].releaseId}`);
            this.setState({ goingBackwards: false });
            this._setReleaseArray();
        }
    }

    goToPreviousPage() {
        const { userId, projectId, releases } = this.state;
        if (releases.length) {
            const index = 0;
            this.props.history.push(`${ROUTES.Project}/${userId}/${projectId}?startAfter=${releases[index].releaseId}`);
            this.setState({ goingBackwards: true });
            this._setReleaseArray();
        }
    }

    downloadFile(userId: string, projectId: string, releaseId: string, fileName: string) {
        const url = this.props.firebase.storage.ref(`${getProjectReleaseDocPath(userId, projectId, releaseId)}/${fileName}`).getDownloadURL();
        url.then((val) => {
            downloadFile(val, fileName);
        }).catch(err => handleFirebaseError(err, this.props, 'Failed to fetch download url'));
    }

    render() {
        const styles = {
            fontSize: 14,
            marginRight: '10px',
            borderLeft: 'solid 2px rgba(0, 0, 0, 0.54)',
            paddingLeft: '10px'
        };

        return (
            <React.Fragment>
                <Container maxWidth="md">
                    <Typography variant="h2" component="h1">
                        <span role="img" aria-label="Projects">🚀</span>
                        {this.state.projectData.projectName || 'Project'}
                    </Typography>
                    <Typography variant="h4">
                        Project description
                </Typography>
                    <Typography component="p">
                        {this.state.projectData.description}
                    </Typography>

                    <Typography color="textSecondary" component="span" style={styles}>
                        Project ID: {this.state.projectId}
                    </Typography>

                    {Object.keys(this.state.projectData).length &&
                        (<React.Fragment>
                            <Typography color="textSecondary" component="span" style={styles}>
                                Created: {moment(this.state.projectData.createdAt.toDate().toISOString(), moment.ISO_8601).fromNow()}
                            </Typography>
                            <Typography color="textSecondary" component="span" style={styles}>
                                Last updated: {moment(this.state.projectData.updatedAt.toDate().toISOString(), moment.ISO_8601).fromNow()}
                            </Typography>
                        </React.Fragment>)
                    }

                    <Button
                        style={{ marginTop: '30px' }}
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={() => this.props.history.push(`${ROUTES.NewRelease}/${this.state.userId}/${this.state.projectId}/${POST_SLUG.NewRelease}`)}
                    >
                        Create new release
                    </Button>

                    <List style={{ marginTop: '30px' }}>
                        {
                            this.state.releases.map((release) => {
                                const obj = { release, history: this.props.history, userID: this.state.userId, props: this.props, state: this.state, downloadFile: this.downloadFile, allData : this };
                                return (
                                    <ReleaseCard {...obj} key={release.releaseId} />
                                )
                            })
                        }
                    </List>
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

const ReleaseCard = (obj: { release: ReleaseItem, history: basePropType['history'], userID: string, props: basePropType, state: StateType, downloadFile: typeof LocalComponent['prototype']['downloadFile'], allData : LocalComponent }) => {
    const classes = useStylesList();
    const { release, history, userID, props, state, downloadFile: getDownloadUrl, allData } = obj;
    return (
        <React.Fragment key={release.projectId}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Created: {moment(release.createdAt.toDate().toISOString(), moment.ISO_8601).fromNow()}
                    </Typography>
                    <Typography className={classes.title} gutterBottom>
                        <strong>Notes</strong>
                    </Typography>
                    <Typography variant="body2" component="p" color="textSecondary" className={classes.pos}>
                        {release.notes}
                    </Typography>

                    <Typography className={classes.inline} color="textSecondary" component="span">
                        Last updated: {moment(release.updatedAt.toDate().toISOString(), moment.ISO_8601).fromNow()}
                    </Typography>
                    <Typography className={classes.inline} color="textSecondary" component="span">
                        Release ID: {release.releaseId}
                    </Typography>
                </CardContent>
                <DownloadsComponent {...{ release, props, state, downloadFile: getDownloadUrl }} />
                <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button size="small" variant="outlined" color="primary" onClick={() => history.push(`${ROUTES.Project}/${userID}/${release.projectId}/${release.releaseId}`)}>
                        Edit Release
                        <EditIcon fontSize="small" style={{ marginLeft: '10px' }} />
                    </Button>
                    <Button size="small" variant="text" color="secondary" onClick={allData.showDeleteReleaseDialog}>
                        Delete
                        <DeleteIcon fontSize="small" style={{ marginLeft: '10px' }} />
                    </Button>
                    {/* <IconButton aria-label="delete">
                        <DeleteIcon fontSize="default" color="secondary" />
                    </IconButton> */}
                </CardActions>
            </Card>
        </React.Fragment>
    )
}

const DownloadsComponent = (obj: { release: ReleaseItem, props: basePropType, state: StateType, downloadFile: LocalComponent['downloadFile'] }) => {
    const release = obj.release;
    const userId = obj.state.userId;
    const projectId = obj.state.projectId;
    const releaseId = release.releaseId;

    return (release.assets && release.assets.length) ? (
        <React.Fragment>
            <CardContent>
                <strong>All Downloads</strong>
                {(release.assets).map((rel) => (
                    <div key={rel}>
                        <Link variant="body2" color="primary" target="_blanck" onClick={() => obj.downloadFile(userId, projectId, releaseId, rel)} style={{ cursor: 'pointer', display: 'inline-block' }}>
                            {rel}
                        </Link>
                    </div>
                ))}
            </CardContent>
        </React.Fragment>
    ) : (<React.Fragment></React.Fragment>)
}

const ReleaseListPage = withAllProviders(LocalComponent);
export { ReleaseListPage }
