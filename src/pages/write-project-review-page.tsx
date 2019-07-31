import React, { Component } from 'react'
import { Container, Card, Avatar, Typography, TextField, Button, Grid, withStyles } from '@material-ui/core';
import { PasswordForgetLink } from './forgot-password-page';
import RateReviewIcon from '@material-ui/icons/RateReview'
import { SignUpLink } from './signup-page';
import { basePropType } from '../basePropType';
import { globalStyles } from '../components/common-components';
import { withAllProviders } from '../providers/all-providers';
import { MATCH_PARAMS, ROUTES } from '../data/routes';
import { ProjectData, ProjectReviewInterface } from '../interfaces';
import { getProjectDocPath, getProjectReviewsDocPath } from '../data/paths';
import { handleFirebaseError } from '../util';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { progress } from '../components/header-component';


interface StateType {
    // projectId: string;
    review: Partial<ProjectReviewInterface>
}

class LocalComponent extends Component<basePropType, Partial<StateType>> {

    INITIAL_STATE: StateType = {
        // projectId: '',
        review: {}
    }

    constructor(props: basePropType) {
        super(props);
        const userId = this.props.match.params[MATCH_PARAMS.USER_ID] || this.props.firebase.auth.currentUser!.uid;

        progress.showProgressBar();
        this.props.firebase.firestore.doc(getProjectReviewsDocPath(userId, this.props.urlProjectId!, this.props.firebase.auth.currentUser!.uid)).get()
            .then((snap) => {
                this.setState({ review: snap.data() || {} })
            })
            .catch((err) => handleFirebaseError(this.props, err, 'Failed to fetch project data'))
            .finally(() => progress.hideProgressBar());
    }

    state: StateType = this.INITIAL_STATE;

    onSubmit(e: any) {
        e.preventDefault();

        this.state.review.userId = this.props.firebase.auth.currentUser!.uid;
        this.props.firebase.firestore.doc(getProjectReviewsDocPath(this.props.urlUserId!, this.props.urlProjectId!, this.props.firebase.auth.currentUser!.uid))
            .set(this.state.review)
            .then(() => {
                this.props.enqueueSnackbar('Submitted review', { variant: 'success' });
                this.props.history.push(`${ROUTES.PROJECT_PAGE}/${this.props.urlUserId!}/${this.props.urlProjectId!}`);
            })
            .catch((err) => handleFirebaseError(this.props, err, 'Failed to submit review'))
    }

    onChange(event: any) {
        this.setState({ review: Object.assign(this.state.review, { [event.target.name]: event.target.value }) });
    }

    render() {
        const classes = this.props.classes!;
        const { rating, title, content } = this.state.review;
        const isInvalid = !title || !content || !rating;

        return (
            <Container component="section" maxWidth="sm">
                <Card style={{ padding: '10px 40px' }}>
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <RateReviewIcon />
                        </Avatar>
                        <Typography component="h1" variant="h3">
                            Review
                        </Typography>
                        <form className={classes.form} onSubmit={this.onSubmit.bind(this)}>
                            <Box component="fieldset" mb={3} borderColor="transparent">
                                <Typography component="legend">Review</Typography>
                                <Rating
                                    name="rating"
                                    value={rating ? Number(rating) : 0}
                                    onChange={this.onChange.bind(this)}
                                />
                            </Box>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth

                                label="Title"
                                name="title"
                                type="text"
                                autoFocus

                                value={title || ''}
                                onChange={this.onChange.bind(this)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth

                                label="Content"
                                name="content"
                                type="text"

                                multiline
                                rows="4"

                                value={content || ''}
                                onChange={this.onChange.bind(this)}

                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={isInvalid}
                            >
                                Submit
                            </Button>
                        </form>
                    </div>
                </Card>
            </Container>
        )
    }
}

export const WriteProjectReviewPage = withStyles(globalStyles as any)(withAllProviders(LocalComponent));
