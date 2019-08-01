import React, { } from 'react'
import { Carousel } from 'react-responsive-carousel';
import { Typography, Container } from '@material-ui/core';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import logo from './../assets/logo.svg';

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
                <Carousel useKeyboardArrows autoPlay infiniteLoop centerMode centerSlidePercentage={50} showThumbs={false}>
                    {
                        props.images.map((img) => {
                            if (img.includes('.mp4')) {
                                return (
                                    <div key={img} style={{height: '250px'}}>
                                        <video key={img} src={img} autoPlay loop muted style={{ maxWidth: '100%', maxHeight: '100%' }}>
                                            <img src={logo} />
                                        </video>
                                    </div>
                                )
                            }
                            return (
                                <div key={img} style={{height: '250px'}}>
                                    <img key={img} src={img} style={{ maxWidth: '100%', maxHeight: '100%', objectFit : 'contain' }} />
                                </div>
                            )
                        })
                    }
                </Carousel>
            </Container>
        </div>
    )
}
