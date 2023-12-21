import React, { useState, useEffect, useRef, useContext } from 'react';
import AppContext from '../context/AppContext.js';

const HomeContent = () => {
    const imageSources = [
        "banner_0.jpg",
        "banner_1.jpg",
        "banner_0.jpg",
        "banner_2.jpg",
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(Math.floor(Math.random() * 7));
    const [currentNewsDisplay, setCurrentNewsDisplay] = useState("");
    const { newsData, setSelectedService, handleServiceClick,videoSources } = useContext(AppContext);
    const liWidth = document.body.clientWidth;

    const videoRef = useRef(null);

    // Handle the image carousel
    useEffect(() => {
        const imageTimer = setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageSources.length);
        }, 5000); // Change image every 5 seconds

        return () => clearTimeout(imageTimer);
    }, [currentImageIndex, imageSources.length]);

    // Handle the video carousel


    // Effect to handle the video 'ended' event
    useEffect(() => {
        const videoElement = videoRef.current;

        let isCancelled = false;

        if (videoElement) {
            videoElement.src = `${process.env.PUBLIC_URL}/videos/${videoSources[currentVideoIndex]}`;

            videoElement.load();
            const playPromise = videoElement.play();

            if (playPromise instanceof Promise) {
                playPromise.then(() => {
                    if (isCancelled) {
                        videoElement.pause();
                    }
                }).catch(error => {
                    if (!isCancelled) {
                        console.error('Error attempting to play video:', error);
                    }
                });
            }
        }

        const handleVideoEnd = () => {
            if (!isCancelled) {
                setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
            }
        };

        videoElement?.addEventListener('ended', handleVideoEnd);

        return () => {
            isCancelled = true;
            videoElement?.removeEventListener('ended', handleVideoEnd);
            videoElement?.pause();
        };
    }, [currentVideoIndex, videoSources]);



    useEffect(() => {
        if (newsData && newsData.length) {
            let currentIndex = 0;
            const updateDisplay = () => {
                setCurrentNewsDisplay(newsData[currentIndex].header);
                currentIndex = (currentIndex + 1) % newsData.length;
            }
            updateDisplay();
            const intervalId = setInterval(updateDisplay, 6000);
            return () => clearInterval(intervalId);
        }

    }, [newsData])


    const getSlideStyles = (index) => ({
        position: 'absolute',
        Transition: index === (currentImageIndex + 1) % imageSources.length || index === currentImageIndex ? 'all 1s ease-out' : '',
        WebkitTransition: index === (currentImageIndex + 1) % imageSources.length || index === currentImageIndex ? 'all 1s' : '',
        msTransition: index === (currentImageIndex + 1) % imageSources.length || index === currentImageIndex ? 'all 1s' : '',
        left: liWidth * (index - currentImageIndex - 1) < -1 * liWidth ? liWidth * (imageSources.length + index - currentImageIndex - 1) : liWidth * (index - currentImageIndex - 1),
        opacity: index === currentImageIndex ? 0 : 1,
        width: '100%',
        height: '100%'
    });

    return (
        <div className="main-content" >
            <div className="header-nav-icon-selected align-items-center justify-content-center flip-animation" style={{ overflow: 'hidden', height: '3.4375rem', fontSize: '2rem', color: 'white',border:0 }} key={currentNewsDisplay} onClick={() => { setSelectedService("News") }}>
                &nbsp;&nbsp;NEWS: {currentNewsDisplay}
            </div>
            {/* Image Carousel */}
            <div className="carousel" style={{ height: '10.625rem', overflow: 'hidden' }} onClick={() => {
                handleServiceClick( { name: 'OUR HOTEL', icon: 'accomodation_icon.png', globalId: '07000000' })
            }}>
                {imageSources.map((img, index) => (
                    <img key={index} style={getSlideStyles(index)}
                        src={`${process.env.PUBLIC_URL}/images/general/${img}`}
                        alt={index}
                    />
                ))}
            </div>

            {/* Video Player */}
            <div className="video-player" >
                <video
                    ref={videoRef}
                >
                    <source
                        src={`${process.env.PUBLIC_URL}/videos/${videoSources[currentVideoIndex]}`}
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};

export default HomeContent;
