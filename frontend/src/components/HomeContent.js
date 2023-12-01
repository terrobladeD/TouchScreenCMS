import React, { useState, useEffect, useRef, useContext } from 'react';
import AppContext from '../context/AppContext.js';

const HomeContent = () => {
    const imageSources = [
        "btn1.jpg",
        "btn2.jpg",
        "btn3.jpg",
        "btn4.jpg"
    ];
    const videoSources = [
        "v1.mp4",
        "v2.mp4",
        "v3.mp4",
        "v4.mp4",
        "v5.mp4",
        "v6.mp4",
        "v7.mp4"
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [currentNewsDisplay, setCurrentNewsDisplay] = useState("");
    const { newsData, setSelectedService } = useContext(AppContext);
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
    
        let isCancelled = false; // A flag to track the mounting status of the component
    
        if (videoElement) {
            // Attempt to play the video and catch any errors that may occur
            const playPromise = videoElement.play();
    
            // Ensure playPromise is a Promise object (some browsers may not return a Promise)
            if (playPromise instanceof Promise) {
                playPromise.then(() => {
                    // Video playback was successful
                    if (isCancelled) {
                        videoElement.pause(); // Pause immediately if the component has unmounted
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
    
        // Add event listener
        videoElement?.addEventListener('ended', handleVideoEnd);
    
        // Cleanup function
        return () => {
            isCancelled = true; // Set the cancellation flag
            videoElement?.removeEventListener('ended', handleVideoEnd);
            videoElement?.pause(); // Pause the video
        };
    }, [currentVideoIndex, videoSources.length]);
    

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
            <div className="header-nav-icon-selected align-items-center justify-content-center flip-animation" style={{ overflow: 'hidden', height: '3.4375rem', fontSize: '2rem', color: 'white' }} key={currentNewsDisplay} onClick={() => { setSelectedService("News") }}>
                &nbsp;&nbsp;NEWS: {currentNewsDisplay}
            </div>
            {/* Image Carousel */}
            <div className="carousel" style={{ height: '10.625rem', overflow: 'hidden' }}>
                {imageSources.map((img, index) => (
                    <img key={index} style={getSlideStyles(index)}
                        src={`${process.env.PUBLIC_URL}/images/main/${img}`}
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
