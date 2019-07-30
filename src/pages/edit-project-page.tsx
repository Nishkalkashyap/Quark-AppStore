import React, { Component } from 'react'
import { basePropType } from '../basePropType';
import { MATCH_PARAMS, ROUTES } from '../data/routes';
import { ProjectData } from '../interfaces';
import { cloneDeep } from 'lodash';
import { getProjectDocPath, getProjectStorageImagesPath } from '../data/paths';
import { handleFirebaseError } from '../util';
import { withAllProviders } from '../providers/all-providers';
import { withOriginalOwner } from '../providers/owner-guard';
import { Container, Card, Typography, TextField, Button, Zoom, Paper, Fab, Tooltip } from '@material-ui/core';
import { globalStyles, useStyles } from '../components/common-components';
import { withStyles } from '@material-ui/styles';
import { DropZoneComponent, FilesToUpload } from '../components/drop-zone';
import DeleteIcon from '@material-ui/icons/Delete';
import { progress, dialog } from '../components/header-component';

interface StateType {
    userId: string,
    projectId: string,
    projectData: Partial<ProjectData>,
    isOwner: boolean
    images: string[]
    filesToUpload: FilesToUpload
    uploadSize: number
}

const FILE_UPLOAD_LIMIT = 10000000;
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif'];
class LocalComponent extends Component<basePropType> {

    INITIAL_STATE: StateType = {
        userId: '',
        projectId: '',
        projectData: {},
        isOwner: false,
        images: [],
        filesToUpload: {},
        uploadSize: 0
    }

    constructor(props: basePropType) {
        super(props);
        this._setInitialState();
        this._setProjectData();
    }

    private _setInitialState() {
        const userId = this.props.match.params[MATCH_PARAMS.USER_ID] || this.props.firebase.auth.currentUser!.uid;
        const projectId = this.props.match.params[MATCH_PARAMS.PROJECT_ID];

        this.state = cloneDeep(this.INITIAL_STATE);
        this.state.userId = userId;
        this.state.projectId = projectId;

        progress.showProgressBar();
        this.props.firebase.storage.ref(getProjectStorageImagesPath(userId, projectId))
            .list()
            .then((list) => {
                const promises = list.items.map((item) => {
                    return item.getDownloadURL()
                });
                return Promise.all(promises);
            })
            .then((val) => {
                this.setState({ images: val } as Partial<StateType>)
            })
            .catch((err) => { console.log(err); handleFirebaseError(this.props, err, 'Could not fetch images') })
            .finally(() => progress.hideProgressBar());
    }

    state: StateType = {} as any;

    private _setProjectData() {
        this.props.firebase.firestore.doc(getProjectDocPath(this.state.userId, this.state.projectId))
            .get()
            .then((snap) => {
                if (!snap.exists) {
                    this.props.history.push(ROUTES.NOT_FOUND);
                    return;
                }
                this.setState({ projectData: snap.data() });
            })
            .catch((err) => handleFirebaseError(err, this.props, 'Could not fetch project data'));
    }

    onSubmit = (event: any) => {
        event.preventDefault();
        const self = this;

        const userId = this.props.match.params[MATCH_PARAMS.USER_ID];
        const projectId = this.props.match.params[MATCH_PARAMS.PROJECT_ID];

        const dataToSend: Partial<ProjectData> = {
            projectName: this.state.projectData.projectName,
            description: this.state.projectData.description,
        }

        uploadFilesToBucket()
            .then(() => {
                return this.props.firebase.firestore.doc(getProjectDocPath(this.props.firebase.auth.currentUser!.uid, this.state.projectId)).set(dataToSend, { merge: true })
            })
            .then(() => {
                this.props.enqueueSnackbar('Project updated', { variant: 'success' });
                this.props.history.push(`${ROUTES.PROJECT_PAGE}/${this.props.firebase.auth.currentUser!.uid}/${this.state.projectId}`);
            })
            .catch((err) => { handleFirebaseError(this.props, err, 'Failed to update project'); })

        async function uploadFilesToBucket() {
            const releaseBucketFolder = getProjectStorageImagesPath(userId, projectId);
            const bucketUploadPromises = Object.keys(self.state.filesToUpload).map((key) => {
                const file = self.state.filesToUpload[key];
                const ref = self.props.firebase.storage.ref(`${releaseBucketFolder}/${file.file.name}`);
                const task = ref.put(file.buffer);
                task.on('state_changed', (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    file.percent = progress;
                    self.setState({ filesToUpload: self.state.filesToUpload } as any);
                });
                return task;
            });
            return await Promise.all(bucketUploadPromises);
        }
    };

    onChange = (event: any) => {
        const data = this.state.projectData;
        this.setState({ projectData: Object.assign(data, { [event.target.name]: event.target.value }) });
    };

    addFiles(files: FilesToUpload, size: number) {
        this.setState({ filesToUpload: files, uploadSize: size } as Partial<StateType>)
    }

    deleteLocalImage(fileKey: string) {
        const ftu = this.state.filesToUpload;
        delete ftu[fileKey];
        this.setState({ filesToUpload: ftu } as Partial<StateType>);
    }

    deleteCloudImage(url: string) {

        dialog.showMessageBox<'Yes' | 'Cancel'>('Delete image', 'Are you sure you want to delete this image. This action is irreversible', ['Yes', 'Cancel'], 'question')
            .then((val) => {
                if (val == 'Yes') {
                    this.props.enqueueSnackbar('Deleting image', { variant: 'info' });
                    this.props.firebase.storage.refFromURL(url).delete()
                        .then(() => {
                            const findIndex = this.state.images.findIndex((val) => val === url);
                            if (findIndex !== -1) {
                                this.state.images.splice(findIndex, 1);
                                this.setState({ images: this.state.images } as Partial<StateType>);
                                this.props.enqueueSnackbar('Image deleted', { variant: 'success' });
                            }
                        }).catch((err) => handleFirebaseError(this.props, err, 'Failed to delete image'));
                }
            }).catch(console.error);
    }

    render() {
        const classes = this.props.classes!;
        const { projectData, images, filesToUpload } = this.state;
        const { description, projectName } = projectData!;
        const isInvalid = !projectName || !description;

        return (
            <div>
                <Container component="section" maxWidth="md">
                    <Card style={{ padding: '10px 40px' }}>
                        <div className={classes.paper}>
                            <Typography component="h1" variant="h3">
                                Edit Project
                            </Typography>
                            <form className={classes.form} onSubmit={this.onSubmit}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth

                                    label="Name"
                                    name="projectName"
                                    type="text"
                                    autoFocus

                                    value={projectName || ''}
                                    onChange={this.onChange}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth

                                    label="Description"
                                    name="description"
                                    type="text"
                                    autoFocus

                                    multiline
                                    rows="4"


                                    value={description || ''}
                                    onChange={this.onChange}
                                />
                                {images.length > 0 &&
                                    <Paper elevation={0} style={{ border: 'solid 1px rgba(0,0,0,0.23)', padding: '15px 10px' }}>
                                        <Typography color="textSecondary"> Existing images</Typography>
                                        <div style={{ display: 'flex', maxWidth: '100%', overflowX: 'auto', margin: '15px 0px' }}>
                                            {images.map((img, index) => (
                                                <ImageComponent key={img + index} img={img} index={index} onDelete={() => this.deleteCloudImage(img)} />
                                            ))}
                                        </div>
                                    </Paper>}
                                {Object.keys(filesToUpload).length > 0 &&
                                    <Paper elevation={0} style={{ border: 'solid 1px rgba(0,0,0,0.23)', padding: '15px 10px' }}>
                                        <Typography color="textSecondary"> Images to upload</Typography>
                                        <div style={{ display: 'flex', maxWidth: '100%', overflowX: 'auto', margin: '15px 0px' }}>
                                            {Object.keys(filesToUpload).map((file, index) => {
                                                const url = URL.createObjectURL(new Blob([filesToUpload[file].buffer]));
                                                return (
                                                    <ImageComponent key={url + index} img={url} index={index} onDelete={() => this.deleteLocalImage(file)} />
                                                )
                                            })}
                                        </div>
                                    </Paper>}
                                <DropZoneComponent addFiles={this.addFiles.bind(this)} forceUpdate={this.forceUpdate.bind(this)} uploadLimit={FILE_UPLOAD_LIMIT} props={this.props} allowedExtensions={ALLOWED_EXTENSIONS} ></DropZoneComponent>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    disabled={isInvalid}
                                >
                                    Update
                                </Button>
                            </form>
                        </div>
                    </Card>
                </Container>
            </div>
        )
    }
}

const ImageComponent = (props: { img: string, index: number, onDelete: Function }) => {
    const { img, index, onDelete } = props;
    const classes = useStyles();
    return (
        <Zoom in={true} style={{ margin: '10px 10px', maxWidth: '200px', transitionDelay: index ? 200 * index + 'ms' : '0ms' }}>
            <Paper elevation={4} className={classes.paper} style={{ position: 'relative' }}>
                <img src={img} alt="" width="200px" style={{ margin: 'auto' }} />
                <Tooltip title="Delete">
                    <DeleteIcon fontSize="small" color="error" style={{ position: 'absolute', top: '0px', right: '0px', cursor: 'pointer' }} onClick={() => onDelete()} />
                </Tooltip>
            </Paper>
        </Zoom>
    )
}



const EditProjectPage = withStyles(globalStyles as any)(withAllProviders(withOriginalOwner(LocalComponent)));
export { EditProjectPage };
