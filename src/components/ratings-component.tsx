import React from 'react'
import { ProjectStats } from '../interfaces';
import { withStyles } from '@material-ui/styles';
import { lighten } from '@material-ui/core/styles';
import { LinearProgress, Typography } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star'
import Rating from '@material-ui/lab/Rating';

const BorderLinearProgress = withStyles({
    root: {
        height: 10,
        backgroundColor: lighten('rgba(0,0,0,0.87)', 0.5),
    },
    bar: {
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.87)',
    },
})(LinearProgress);

export function RatingsComponent(props: ProjectStats) {
    // const stars = Object.keys(props).filter((val) => !!val.match(/Stars/gi));
    const stars = [props.numberOfStars_1, props.numberOfStars_2, props.numberOfStars_3, props.numberOfStars_4, props.numberOfStars_5];
    let total = 0;
    stars.map((star) => {
        if (star) {
            total = total + star;
        }
    })

    return (
        <div style={{ margin: '100px 0px' }}>
            <Typography component="p" variant="h3">
                Reviews
            </Typography>
            <div style={{ margin: '30px 0px', display: 'flex' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'column', marginRight: '30px' }}>
                    <Typography component="p" variant="h1" style={{ textAlign: 'center' }}>
                        {props.averageRating || 0}
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Rating size="small" style={{ margin: '10px 10px' }} value={props.averageRating || 0} readOnly />
                        <Typography component="p">
                            {props.numberOfReviews || 0}
                        </Typography>
                    </div>
                </div>
                <div style={{ flexGrow: 1 }}>
                    {
                        stars.map((star, index) => {
                            const percent = ((star || 0) / (total || 1)) * 100;
                            return (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px 0px' }}>
                                    <Typography variant="body1" style={{ margin: '0px 10px' }}>{index + 1}</Typography>
                                    <StarIcon fontSize="small" style={{ marginRight: '10px' }} />
                                    <BorderLinearProgress
                                        style={{ flexGrow: 1 }}
                                        variant="determinate"
                                        color="secondary"
                                        value={percent}
                                    />
                                    <Typography variant="body1" style={{ margin: '0px 10px', minWidth: '40px' }}>{`${percent}%`}</Typography>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
