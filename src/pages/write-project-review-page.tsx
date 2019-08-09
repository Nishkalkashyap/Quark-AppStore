import React, { Component } from 'react'
import { Typography, withStyles } from '@material-ui/core';
import RateReviewIcon from '@material-ui/icons/RateReview'
import { basePropType } from '../basePropType';
import { globalStyles } from '../components/common-components';
import { withAllProviders } from '../providers/all-providers';
import { MATCH_PARAMS, NEW_ROUTES } from '../data/routes';
import { ProjectReviewInterface, GenericFormData } from '../interfaces';
import { getDocument_review } from '../data/paths';
import { handleFirebaseError } from '../util';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { progress } from '../components/header-component';
import GenericFormComponent from '../components/generic-form-component';


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
        progress.showProgressBar();
    }

    componentWillMount() {
        const userId = this.props.match.params[MATCH_PARAMS.USER_ID] || this.props.firebase.auth.currentUser!.uid;
        this.listeners.push(
            this.props.firebase.getListenerForDocument(this.props.firebase.firestore.doc(getDocument_review(userId, this.props.urlProjectId!, this.props.firebase.auth.currentUser!.uid)), (snap) => {
                this.setState({ review: snap.data() || {} });
                progress.hideProgressBar();
            })
        );
    }

    state: StateType = this.INITIAL_STATE;
    listeners: Function[] = [];
    componentWillUnmount() { this.listeners.map((listener) => { listener() }) };

    onSubmit(e: any) {
        e.preventDefault();

        this.state.review.userId = this.props.firebase.auth.currentUser!.uid;
        this.props.firebase.firestore.doc(getDocument_review(this.props.urlUserId!, this.props.urlProjectId!, this.props.firebase.auth.currentUser!.uid))
            .set(this.state.review)
            .then(() => {
                this.props.enqueueSnackbar('Submitted review', { variant: 'success' });
                this.props.history.push(`/${this.props.urlUserId!}/${this.props.urlProjectId!}/${NEW_ROUTES.PROJECT_PAGE.base}`);
            })
            .catch((err) => handleFirebaseError(this.props, err, 'Failed to submit review'))
    }

    onChange(event: any) {
        this.setState({ review: Object.assign(this.state.review, { [event.target.name]: event.target.value }) });
    }

    render() {
        const { rating, title, content } = this.state.review;
        const isInvalid = !title || !content || !rating;

        const data: GenericFormData['data'] = {
            hello: {
                component: (
                    <Box component="fieldset" mb={3} borderColor="transparent">
                        <Typography component="legend">Review</Typography>
                        <Rating
                            name="rating"
                            value={rating ? Number(rating) : 0}
                            onChange={this.onChange.bind(this)}
                        />
                    </Box>
                )
            },
            title: {
                formData: {
                    label: "Title",
                    type: "text",
                    required: true,
                    value: title || ''
                }
            },
            content: {
                formData: {
                    label: "Content",
                    type: "text",
                    required: true,
                    value: content || '',

                    multiline: true,
                    rows: "4"
                }
            }
        }

        return (
            <GenericFormComponent
                headingText="Review"
                icon={RateReviewIcon}
                isInvalid={isInvalid}
                onChange={this.onChange.bind(this)}
                onSubmit={this.onSubmit.bind(this)}
                submitButtonText="Submit"
                data={data}
            />
        );
    }
}

export const WriteProjectReviewPage = withStyles(globalStyles as any)(withAllProviders(LocalComponent));
