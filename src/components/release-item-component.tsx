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
import { handleFirebaseError, downloadFile } from '../util';

type ReleaseComponentType = basePropType & {
    release: ReleaseItem, isOwner: boolean, methods: {
        showEditReleaseDialog: (userId: string, projectId: string, releaseId: string, notes: string) => void,
        showDeleteReleaseDialog: (userId: string, projectId: string, releaseId: string) => void,
    }
}
export function ReleaseItemComponent(props: ReleaseComponentType) {
    const classes = useStylesList();
    const { release, isOwner, methods } = props;

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
                {isOwner && <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* {<CardActions style={{ display: 'flex', justifyContent: 'space-between' }}> */}
                    <ButtonGroup size="small" aria-label="small outlined button group">
                        <Button onClick={() => methods.showEditReleaseDialog(props.userId!, release.projectId, release.releaseId, release.notes)}>
                            Edit Notes
                            <EditIcon fontSize="small" style={{ marginLeft: '10px' }} />
                        </Button>
                        <Button onClick={() => methods.showDeleteReleaseDialog(props.userId!, release.projectId, release.releaseId)}>
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
    props.firebase.storage.ref(`${getProjectReleaseDocPath(props.userId!, props.projectId!, releaseId)}/${filename}`).getDownloadURL()
        .then((val) => {
            return downloadFile(val, filename);
        })
        .then(() => {
            if (!isOwner) {
                return props.firebase.firestore.doc(getProjectStatsDocPath(props.userId!, props.projectId!)).set(({
                    numberOfDownloads: firebase.firestore.FieldValue.increment(1) as any
                } as Partial<ProjectData>), { merge: true });
            }
        })
        .catch(err => handleFirebaseError(err, props, 'Failed to fetch download url'));
}
