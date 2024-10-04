import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "./countdown.scss";
import {toast} from "react-toastify";
import {getNewEvent} from "../../../../services/customer/homeService";
import {Link} from "react-router-dom";

const Countdown = () => {

    const [eventFootball, setEventFootball] = useState({});
    const [backgroundImage, setBackgroundImage] = useState('');
    const [backgroundHeight, setBackgroundHeight] = useState('300px');
    const [isCountdownFinished, setIsCountdownFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState({});

    const fetchNewEvent = async () => {
        try {
            let res = await getNewEvent();
            if(res && res.EC === 0) {
                setEventFootball(res.DT);
            } else {
                console.error(res.EM);
            }
        } catch (e) {
            console.error(e);
            toast.error(e);
        }
    }

    useEffect(() => {
        fetchNewEvent();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.matchMedia("(max-width: 768px)").matches) {
                setBackgroundImage(`${process.env.REACT_APP_URL_BACKEND}/${eventFootball.imageMobile}`);
                setBackgroundHeight('800px');
            } else {
                setBackgroundImage(`${process.env.REACT_APP_URL_BACKEND}/${eventFootball.imageDesktop}`);
                setBackgroundHeight('500px');
            }
        };

        if (eventFootball.imageMobile && eventFootball.imageDesktop) {
            handleResize();
            window.addEventListener('resize', handleResize);
        }

        // Clean up event listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, [eventFootball]);

    const calculateTimeLeft = () => {
        const difference = +new Date(eventFootball.eventDate) - +new Date();
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

    useEffect(() => {
        if (eventFootball.eventDate) {
            const timer = setTimeout(() => {
                const newTimeLeft = calculateTimeLeft();
                setTimeLeft(newTimeLeft);

                if (Object.keys(newTimeLeft).length === 0) {
                    setIsCountdownFinished(true);
                }
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [eventFootball, timeLeft]);

    const timerComponents = [
        { label: 'DAY', value: timeLeft.days },
        { label: 'HOURS', value: timeLeft.hours },
        { label: 'MINUTES', value: timeLeft.minutes },
        { label: 'SECONDS', value: timeLeft.seconds }
    ]

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
            <div className="countdown-overlay"></div>
            <Row className="countdown-content countdown-position-absolute w-100 text-light d-flex justify-content-center align-items-center">
                {isCountdownFinished ? (
                        <Col xs={12} className="text-center">
                            <h2 style={{color: "white", fontSize: "3rem"}}>BẮT ĐẦU NÀO!</h2>
                        </Col>
                    ) : (
                        <Col xs={12} lg={6} className="text-center order-lg-1 order-2">
                            <div className="d-flex justify-content-center align-items-center flex-wrap">
                                {timerComponents.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <div className="text-center d-flex flex-column align-items-center mx-2">
                                            <div style={{ fontSize: '2rem' }}>
                                                {item.value !== undefined ? item.value : '00'}
                                            </div>
                                            <div style={{ fontSize: '1.5rem' }}>
                                                {item.label}
                                            </div>
                                        </div>
                                        {index < timerComponents.length - 1 && <span className="mx-2" style={{ fontSize: '1.5rem' }}>:</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </Col>
                    )
                }
                <Col xs={12} lg={6} className="p-4 text-center order-lg-1 order-1">
                    <div className="d-flex flex-column justify-content-center align-items-center flex-wrap">
                        <h2 style={{color: "white", fontSize: "2.5rem"}}>{eventFootball.name}</h2>
                        <span style={{
                            color: "white",
                            fontSize: "2rem"
                        }}>{eventFootball.description}</span>
                        <Link to={`${eventFootball.url}`}>
                            <button type='button' className='btn btn-outline-primary mt-3'>Mua ngay</button>
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
);
};

export default Countdown;
