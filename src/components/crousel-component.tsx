import React, { useState } from 'react'
import { Carousel } from 'react-responsive-carousel';
import { Typography, Container } from '@material-ui/core';

export function CrouselComponent(props: { images: string[] }) {

    if (!props.images.length) {
        return (<div></div>)
    }

    return (
        <div style={{ margin: '100px 0px' }} className="crousel-component">
            <Typography component="p" variant="h3" style={{ marginBottom: '30px' }}>
                Screenshots
            </Typography>
            <Container style={{ margin: `30px 0px` }}>
                <Carousel useKeyboardArrows autoPlay infiniteLoop centerMode centerSlidePercentage={50}>
                    {
                        props.images.map((img) => {
                            return (
                                <div key={img}>
                                    <img src={img} />
                                </div>
                            )
                        })
                    }
                </Carousel>
            </Container>
        </div>
    )
}
