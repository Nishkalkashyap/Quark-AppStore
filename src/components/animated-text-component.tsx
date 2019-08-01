import React, { useEffect } from 'react';
import anime from 'animejs';

export function AnimatedTextComponent(props: { text: string[] }) {

    const ml4 = {
        opacityIn: [0, 1],
        scaleIn: [0.2, 1],
        scaleOut: 3,
        durationIn: 800,
        durationOut: 600,
        delay: 500
    };

    useEffect(() => {
        const timeline = anime.timeline({ loop: true });
        let timelineRef = timeline;
        props.text.map((val, index) => {
            timelineRef
                .add({
                    targets: `.ml4 .letters-${index}`,
                    opacity: ml4.opacityIn,
                    scale: ml4.scaleIn,
                    duration: ml4.durationIn
                })
                .add({
                    targets: `.ml4 .letters-${index}`,
                    opacity: 0,
                    scale: ml4.scaleOut,
                    duration: ml4.durationOut,
                    easing: "easeInExpo",
                    delay: ml4.delay
                });

            if (index === props.text.length - 1) {
                timeline.add({
                    targets: '.ml4',
                    opacity: 0,
                    duration: 500,
                    delay: 500
                });
            }
        });

        return timeline.pause
    });

    return (
        <div className="ml4" style={{ display: 'inline-block' }}>
            {
                props.text.map((val, index) => {
                    return <span key={val + index} className={`letters letters-${index}`}>{val}</span>
                })
            }
        </div>
    )
}
