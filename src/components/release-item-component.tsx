import React from 'react'
import { basePropType } from '../basePropType';
import { ReleaseItem, ProjectData } from '../interfaces';
import { Card, CardContent, Typography, CardActions, ButtonGroup, Button, Link, Chip, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, makeStyles, createStyles } from '@material-ui/core';
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { getDocument_release, getDocument_stats } from '../data/paths';
import firebase from 'firebase';
import { handleFirebaseError, downloadReleaseItem } from '../util';
import { dialog } from './header-component';
import { StandardProperties } from 'csstype';

import EditDownloadIcon from '@material-ui/icons/Edit';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import UpdateDownloadIcon from '@material-ui/icons/Update';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStylesList = makeStyles(
    createStyles({
        card: {
            minWidth: 275,
            marginBottom: '45px'
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 14,
        },
        pos: {
            marginBottom: 12,
        },
        inline: {
            fontSize: 14,
            marginRight: '10px',
            borderLeft: 'solid 2px rgba(0, 0, 0, 0.54)',
            paddingLeft: '10px'
        },
    }),
);

export function ReleaseItemComponent(props: basePropType & {
    release: ReleaseItem
}) {
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
            props.firebase.firestore.doc(getDocument_release(userId, projectId, releaseId)).update({
                notes: updatedNotes
            }).then(() => {
                props.enqueueSnackbar('Release updated', { variant: 'success' });
            }).catch((err) => handleFirebaseError(props, err, 'Failed to delete release'));
        }
    }

    const buildFile = release.assets.find((file) => file.endsWith('.build.qrk'));
    const projectFile = release.assets.find((file) => file.endsWith('.qrk') && !file.endsWith('.build.qrk'));

    async function showDeleteReleaseDialog(userId: string, projectId: string, releaseId: string) {
        if (!props.isOwner) {
            return;
        }

        const result = await dialog.showMessageBox<'Yes' | 'Cancel'>('Delete release', 'Are you sure you want to delete this release. This action is irreversible', ['Yes', 'Cancel'], 'warning');
        if (result == 'Yes') {
            deleteRelease();
        }

        function deleteRelease() {
            props.firebase.firestore.doc(getDocument_release(userId, projectId, releaseId)).delete().then(() => {
                props.enqueueSnackbar('Release deleted', { variant: 'success' });
            }).catch((err) => handleFirebaseError(props, err, 'Failed to delete release'));
        }
    }

    const chipStyle: StandardProperties = {
        color: 'inherit', borderColor: 'transparent', marginTop: '15px', marginRight: '15px'
    }
    const chipDownloadIcon: StandardProperties = {
        color: 'inherit'
    }

    return (
        <React.Fragment key={release.projectId}>
            <Card className={classes.card} style={{ padding: '20px 10px' }}>
                <CardContent style={{ padding: '0px 20px' }}>
                    <Chip label={`Created: ${moment(release.createdAt.toDate().toISOString(), moment.ISO_8601).fromNow()}`} variant="outlined" size="small" icon={<EditDownloadIcon style={chipDownloadIcon} />} style={chipStyle} />
                    <Chip label={`Last updated: ${moment(release.updatedAt.toDate().toISOString(), moment.ISO_8601).fromNow()}`} variant="outlined" size="small" icon={<UpdateDownloadIcon style={chipDownloadIcon} />} style={chipStyle} />
                    <Chip label={`Release ID: ${release.releaseId}`} variant="outlined" size="small" icon={<FiberNewIcon style={chipDownloadIcon} />} style={chipStyle} />
                </CardContent>
                <CardContent>
                    <Typography className={classes.title} gutterBottom>
                        <strong>Notes</strong>
                    </Typography>
                    <Typography variant="body2" component="p" color="textSecondary" className={classes.pos}>
                        {release.notes}
                    </Typography>
                    <DownloadsComponent {...props} />
                </CardContent>
                <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {(buildFile || projectFile) &&
                        <ButtonGroup size="small" color="primary" variant="outlined" aria-label="small outlined button group">
                            {(projectFile) && <Button onClick={() => downloadReleaseItem({ ...props, filename: projectFile })}>
                                Download Project
                        </Button>}
                            {(buildFile) && <Button onClick={() => downloadReleaseItem({ ...props, filename: buildFile })}>
                                Download Build
                        </Button>}
                        </ButtonGroup>
                    }
                    {(isOwner) &&
                        <ButtonGroup size="small" variant="outlined" aria-label="small outlined button group">
                            <Button onClick={() => showEditReleaseNotesDialog(props.urlUserId!, release.projectId, release.releaseId, release.notes)}>
                                Edit Notes
                            <EditIcon fontSize="small" style={{ marginLeft: '10px' }} />
                            </Button>
                            <Button onClick={() => showDeleteReleaseDialog(props.urlUserId!, release.projectId, release.releaseId)}>
                                Delete Release
                            <DeleteIcon fontSize="small" style={{ marginLeft: '10px' }} />
                            </Button>
                        </ButtonGroup>
                    }
                </CardActions>
            </Card>
        </React.Fragment>
    )
}

const DownloadsComponent = (props: basePropType & { release: ReleaseItem }) => {
    const { release } = props;
    return (release.assets && release.assets.length) ? (
        <React.Fragment>
            <ExpansionPanel style={{ boxShadow: 'none', border: 'solid 1px var(--border-color)', borderRadius: '4px' }}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>All downloads</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ display: 'flex', flexDirection: 'column' }}>
                    {(release.assets).map((rel) => (
                        <div key={rel}>
                            <Link variant="body2" color="primary" target="_blanck" onClick={() => downloadReleaseItem({ ...props, filename: rel })} style={{ cursor: 'pointer', display: 'inline-block' }}>
                                {rel}
                            </Link>
                        </div>
                    ))}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </React.Fragment>
    ) : (<React.Fragment></React.Fragment>)
}
