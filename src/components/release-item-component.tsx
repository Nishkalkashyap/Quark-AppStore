import React from 'react'
import { basePropType } from '../basePropType';
import { ReleaseItem, ProjectData } from '../interfaces';
import { useStylesList } from '../pages/project-list-page';
import { Card, CardContent, Typography, CardActions, ButtonGroup, Button, Link } from '@material-ui/core';
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { getProjectReleaseDocPath, getProjectStatsDocPath } from '../data/paths';
import firebase from 'firebase';
import { handleFirebaseError } from '../util';
import { dialog } from './header-component';

type ReleaseComponentType = basePropType & {
    release: ReleaseItem
}
export function ReleaseItemComponent(props: ReleaseComponentType) {
    const classes = useStylesList();
    const { release, isOwner } = props;

    async function showEditReleaseNotesDialog(userId: string, projectId: string, releaseId: string, notes: string) {
        if (!props.isOwner) {
            return;
        }

        const result = await dialog.showFormDialog<'Yes' | 'Cancel'>('Delete release', 'Are you sure you want to delete this release. This action is irreversible', 'Notes', ['Yes', 'Cancel'], notes);
        if (result.result.button == 'Yes') {
            editRelease(result.result.text);
        }

        function editRelease(updatedNotes: string) {
            props.firebase.firestore.doc(getProjectReleaseDocPath(userId, projectId, releaseId)).update({
                notes: updatedNotes
            }).then(() => {
                props.enqueueSnackbar('Release updated', { variant: 'success' });
            }).catch((err) => handleFirebaseError(props, err, 'Failed to delete release'));
        }
    }

    async function showDeleteReleaseDialog(userId: string, projectId: string, releaseId: string) {
        if (!props.isOwner) {
            return;
        }

        const result = await dialog.showMessageBox<'Yes' | 'Cancel'>('Delete release', 'Are you sure you want to delete this release. This action is irreversible', ['Yes', 'Cancel'], 'warning');
        if (result == 'Yes') {
            deleteRelease();
        }

        function deleteRelease() {
            props.firebase.firestore.doc(getProjectReleaseDocPath(userId, projectId, releaseId)).delete().then(() => {
                props.enqueueSnackbar('Release deleted', { variant: 'success' });
            }).catch((err) => handleFirebaseError(props, err, 'Failed to delete release'));
        }
    }

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
                <DownloadsComponent {...props} />
                {(isOwner) && <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* {<CardActions style={{ display: 'flex', justifyContent: 'space-between' }}> */}
                    <ButtonGroup size="small" aria-label="small outlined button group">
                        <Button onClick={() => showEditReleaseNotesDialog(props.urlUserId!, release.projectId, release.releaseId, release.notes)}>
                            Edit Notes
                            <EditIcon fontSize="small" style={{ marginLeft: '10px' }} />
                        </Button>
                        <Button onClick={() => showDeleteReleaseDialog(props.urlUserId!, release.projectId, release.releaseId)}>
                            Delete Release
                            <DeleteIcon fontSize="small" style={{ marginLeft: '10px' }} />
                        </Button>
                    </ButtonGroup>
                </CardActions>}
            </Card>
        </React.Fragment>
    )
}

const DownloadsComponent = (props: ReleaseComponentType) => {
    const { release } = props;
    return (release.assets && release.assets.length) ? (
        <React.Fragment>
            <CardContent>
                <strong>All Downloads</strong>
                {(release.assets).map((rel) => (
                    <div key={rel}>
                        <Link variant="body2" color="primary" target="_blanck" onClick={() => downloadReleaseItem({ ...props, filename: rel })} style={{ cursor: 'pointer', display: 'inline-block' }}>
                            {rel}
                        </Link>
                    </div>
                ))}
            </CardContent>
        </React.Fragment>
    ) : (<React.Fragment></React.Fragment>)
}

function downloadReleaseItem(props: ReleaseComponentType & { filename: string }) {
    const { filename, isOwner } = props;
    const releaseId = props.release.releaseId;
    props.firebase.storage.ref(`${getProjectReleaseDocPath(props.urlUserId!, props.urlProjectId!, releaseId)}/${filename}`).getDownloadURL()
        .then((val) => {
            // return downloadFile(val, filename);
            window.open(val);
        })
        .then(() => {
            if (!isOwner) {
                return props.firebase.firestore.doc(getProjectStatsDocPath(props.urlUserId!, props.urlProjectId!)).set(({
                    numberOfDownloads: firebase.firestore.FieldValue.increment(1) as any
                } as Partial<ProjectData>), { merge: true });
            }
        })
        .catch(err => handleFirebaseError(err, props, 'Failed to fetch download url'));
}
