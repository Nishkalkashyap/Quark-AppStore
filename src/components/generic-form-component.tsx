import React from 'react'
import { useStyles } from './common-components';
import { Container, Card, Avatar, Typography, Grid, TextField, Button } from '@material-ui/core';
import { GenericFormData } from '../interfaces';
export default function GenericFormComponent(props: GenericFormData) {

    const classes = useStyles();

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
                        <form className={classes.form} onSubmit={() => props.onSubmit()}>
                            <Grid container spacing={2}>
                                {
                                    Object.keys(props.data).map((key) => {

                                        if (props.data[key].component) {
                                            const CurrentComponent = props.data[key].component;
                                            return (<CurrentComponent />)
                                        }

                                        return (
                                            <Grid item xs={12} key={key}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth

                                                    {...props.data[key]}
                                                    name={key}

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
