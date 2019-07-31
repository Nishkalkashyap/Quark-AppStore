import React from 'react'
import { Typography, Button } from '@material-ui/core';
import { StandardProperties } from 'csstype';
import { basePropType } from '../basePropType';
import { ROUTES } from '../data/routes';

export function ReleaseNotesComponent(props: { notes: string, style?: StandardProperties } & basePropType) {
    return (
        <div style={props.style} >
            <Typography component="h3">
                What's new in this version
            </Typography>
            <Typography component="p" style={{ marginBottom: '30px' }}>
                {props.notes}
            </Typography>
            <Button variant='outlined' size="small" onClick={() => props.history.push(`${ROUTES.RELEASE_LIST_PAGE}/${props.urlUserId}/${props.urlProjectId}`)}>
                See all versions
            </Button>
        </ div>
    )
}
