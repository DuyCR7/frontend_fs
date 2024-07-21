import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "./countdown.scss";

const Countdown = () => {

    const [backgroundImage, setBackgroundImage] = useState('/admin/assets/img/Countdown.png');
    const [backgroundHeight, setBackgroundHeight] = useState('300px');

    useEffect(() => {
        const handleResize = () => {
            if (window.matchMedia("(max-width: 768px)").matches) {
                setBackgroundImage('/admin/assets/img/Countdown2.png');
                setBackgroundHeight('800px');
            } else {
                setBackgroundImage('/admin/assets/img/Countdown.png');
                setBackgroundHeight('500px');
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up event listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const calculateTimeLeft = () => {
        const difference = +new Date('2024-07-30') - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = [
        { label: 'DAY', value: timeLeft.days },
        { label: 'HOURS', value: timeLeft.hours },
        { label: 'MINUTES', value: timeLeft.minutes },
        { label: 'SECONDS', value: timeLeft.seconds }
    ]
    //     .map((item, index) => (
    //     <Col key={index} className="text-center d-flex flex-column align-items-center">
    //         <div>
    //             {item.value !== undefined ? item.value : '00'}
    //         </div>
    //         <div>
    //             {item.label}
    //         </div>
    //     </Col>
    // ));

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center position-relative"
            style={{
                minHeight: backgroundHeight,
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="overlay"></div>
            <Row className="position-absolute w-100 text-light d-flex justify-content-center align-items-center">
                <Col xs={12} lg={6} className="text-center">
                    <div className="d-flex justify-content-center align-items-center">
                        {timerComponents.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className="text-center d-flex flex-column align-items-center mx-2">
                                    <div style={{ fontSize: '3rem' }}>
                                        {item.value !== undefined ? item.value : '00'}
                                    </div>
                                    <div style={{ fontSize: '2rem' }}>
                                        {item.label}
                                    </div>
                                </div>
                                {index < timerComponents.length - 1 && <span className="mx-2" style={{ fontSize: '2rem' }}>:</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </Col>
                <Col xs={12} lg={6} className="p-4 text-center order-md-2 order-1">
                    <h2 style={{color: "white",  fontSize: "3rem"}}>Event Information</h2>
                    <span style={{color: "white", fontSize: "2rem"}}>This is some information about the event.</span>
                </Col>
            </Row>
        </Container>
    );
};

export default Countdown;
