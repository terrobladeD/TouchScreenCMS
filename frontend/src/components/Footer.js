import React, { useState, useEffect } from 'react';

const Footer = () => {
    const images = [
        { img_url: 'advertisement_1.jpg', link: '' },
        { img_url: 'advertisement_2.jpg', link: '' },
        { img_url: 'advertisement_3.jpg', link: '' },
        { img_url: 'advertisement_4.jpg', link: '' },
        { img_url: 'advertisement_5.jpg', link: '' },
        { img_url: 'advertisement_6.jpg', link: '' },
        { img_url: 'advertisement_7.jpg', link: '' }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // 5秒后切换图片

        return () => clearTimeout(timer);
    }, [currentIndex, images.length]);

    return (
        <footer style={{ height: '32vw' }}>
            <div className="carousel" style={{width:'100%',height:"100%"}}>
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={index === currentIndex ? 'slide active' : 'slide'}
                        style={{width:'100%',height:"100%"}}
                    >
                        <img
                            src={`${process.env.PUBLIC_URL}/images/advertisement/${image.img_url}`}
                            alt={image.img_url}
                            style={{objectFit:'cover',width:'100%',height:"100%"}}
                        />

                    </div>
                ))}
            </div>
        </footer>
    );
};

export default Footer;
