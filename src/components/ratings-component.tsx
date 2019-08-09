import React, { useState, useEffect } from 'react'
import { ProjectStats } from '../interfaces';
import { withStyles } from '@material-ui/styles';
import { lighten } from '@material-ui/core/styles';
import { LinearProgress, Typography, Link } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star'
import Rating from '@material-ui/lab/Rating';
import { basePropType } from '../basePropType';
import { ROUTES } from '../data/routes';
import { getDocument_stats } from '../data/paths';
import { isEqual } from 'lodash';

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

export function RatingsComponent(props: { userId: string, projectId: string } & basePropType) {

    const [starsData, setStarsData] = useState({ total: 0, stars: [] as any[] });

    const [projectStats, setProjectStats] = useState({} as ProjectStats);
    const { projectId, userId } = props;

    useEffect(() => {
        const listener = props.firebase.getListenerForDocument(props.firebase.firestore.doc(getDocument_stats(userId, projectId)), (snap) => {
            const stats = (snap.data() || {}) as any;
            if (!isEqual(projectStats, stats)) {

                let total = 0;
                const stars = [stats.numberOfStars_1!, stats.numberOfStars_2!, stats.numberOfStars_3!, stats.numberOfStars_4!, stats.numberOfStars_5!];
                stars.map((star) => { if (star) { total = total + star; } });

                setProjectStats(stats);
                setStarsData({ stars, total });
            }
        });

        return listener
    });

    return (
        <div style={{ margin: '100px 0px' }}>
            <Typography component="p" variant="h3">
                Reviews
            </Typography>
            <div style={{ margin: '30px 0px', display: 'flex' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'column', marginRight: '30px' }}>
                    <Typography component="p" variant="h1" style={{ textAlign: 'center' }}>
                        {projectStats.averageRating || 0}
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Rating size="small" style={{ margin: '10px 10px' }} value={projectStats.averageRating || 0} readOnly />
                        <Typography component="p">
                            {projectStats.numberOfReviews || 0}
                        </Typography>
                    </div>
                    <Link onClick={() => props.history.push(`${ROUTES.REVIEW_LIST_PAGE}/${props.urlUserId}/${props.urlProjectId}`)} style={{ cursor: 'pointer', display: 'block', textAlign: 'center' }}>See all reviews</Link>
                </div>
                <div style={{ flexGrow: 1 }}>
                    {
                        starsData.stars.map((star, index) => {
                            const percent = ((star || 0) / (starsData.total || 1)) * 100;
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
