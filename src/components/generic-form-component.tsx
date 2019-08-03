import React, { Component } from 'react'
import { useStyles, globalStyles } from './common-components';
import { Container, Card, Avatar, Typography, Grid, TextField, Button } from '@material-ui/core';
import { GenericFormData } from '../interfaces';
import { withStyles } from '@material-ui/styles';

class LocalComponent extends Component<GenericFormData & { classes: any }> {

    constructor(props: GenericFormData & { classes: any }) {
        super(props);
    }

    render() {
        const props = this.props;
        const classes = this.props.classes;

        return (
            <div>
                <Container component="section" maxWidth="sm">
                    <Card style={{ padding: '10px 40px' }}>
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <props.icon />
                            </Avatar>
                            <Typography component="h1" variant="h3">
                                {props.headingText}
                            </Typography>
                            <form className={classes.form} onSubmit={props.onSubmit as any}>
                                <Grid container spacing={2}>
                                    {
                                        Object.keys(props.data).map((key, index) => {

                                            if (props.data[key].component) {
                                                const CurrentComponent = props.data[key].component;
                                                return (
                                                    <Grid item xs={12} key={key}>
                                                        {CurrentComponent}
                                                    </Grid>
                                                )
                                            }

                                            return (
                                                <Grid item xs={12} key={key}>
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth

                                                        {...props.data[key].formData}
                                                        name={key}
                                                        autoFocus={index == 0}

                                                        onChange={(e) => props.onChange(e)}
                                                    />
                                                </Grid>
                                            )
                                        })
                                    }

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                        disabled={props.isInvalid}
                                    >
                                        {props.submitButtonText}
                                    </Button>
                                </Grid>
                            </form>
                        </div>
                    </Card>
                </Container>
            </div>
        )
    }
}

const GenericFormComponent = withStyles(globalStyles as any)(LocalComponent);
export default GenericFormComponent;
