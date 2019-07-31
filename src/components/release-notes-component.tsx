import React from 'react'
import { Typography } from '@material-ui/core';
import { StandardProperties } from 'csstype';

export function ReleaseNotesComponent(props: { notes: string, style?: StandardProperties }) {
    return (
        <div style={props.style} >
            <Typography component="h3">
                What's new in this version
            </Typography>
            <Typography component="p" style={{ marginBottom: '30px' }}>
                {props.notes}
            </Typography>
        </ div>
    )
}
