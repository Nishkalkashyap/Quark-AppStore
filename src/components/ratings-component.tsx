import React from 'react'
import { ProjectStats } from '../interfaces';
import { withStyles } from '@material-ui/styles';
import { lighten } from '@material-ui/core/styles';
import { LinearProgress, Typography } from '@material-ui/core';
import { PRIMARY_COLOR } from '../util';

const BorderLinearProgress = withStyles({
    root: {
        height: 10,
        backgroundColor: lighten(PRIMARY_COLOR, 0.5),
    },
    bar: {
        borderRadius: 20,
        backgroundColor: PRIMARY_COLOR,
    },
})(LinearProgress);

export function RatingsComponent(props: ProjectStats) {
    // const stars = Object.keys(props).filter((val) => !!val.match(/Stars/gi));
    const stars = [props.numberOfStars_1, props.numberOfStars_2, props.numberOfStars_3, props.numberOfStars_4, props.numberOfStars_5];
    return (
        <React.Fragment>
            {
                stars.map((star, index) => {
                    return (
                        <div>
                            <Typography variant="h6">{index}</Typography>
                            <BorderLinearProgress
                                variant="determinate"
                                color="secondary"
                                value={(props as any)[star!]}
                            />
                        </div>
                    )
                })
            }

        </React.Fragment>
    )
}
