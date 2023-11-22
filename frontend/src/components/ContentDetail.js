import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext.js';
import { Carousel } from 'react-bootstrap';

const ContentDetail = ({ globalId, setGlobalId }) => {
    const [content, setContent] = useState(null);
    const { generalData } = useContext(AppContext);

    const [showMap, setShowMap] = useState(false);
    const [mapName, setMapName] = useState('');
    const [mapUrl, setMapUrl] = useState('');

    useEffect(() => {
        if (globalId && globalId.substring(6, 8) !== "00") {
            const temp1 = generalData.find(data => data.global_id === globalId.substring(0, 2) + '000000');
            if (temp1.attributes_inner === 'sidebar') {
                setContent(temp1.attributes.find(data => data.global_id === globalId));
            } else {
                const temp2 = temp1.attributes.find(data => data.global_id === globalId.substring(0, 4) + '0000');
                if (temp2.attributes_inner === 'sidebar') {
                    setContent(temp2.attributes.find(data => data.global_id === globalId));
                } else {
                    const temp3 = temp2.attributes.find(data => data.global_id === globalId.substring(0, 6) + '00');
                    if (temp3.attributes_inner === 'sidebar') {
                        setContent(temp3.attributes.find(data => data.global_id === globalId));
                    }
                }
            }
        }
    }, [globalId, generalData])

    const handleMapClick = (name, url) => {
        setMapUrl(`${process.env.PUBLIC_URL}/images/general/${url}`);
        setMapName(name)
        setShowMap(true);
    };

    const hideMap = () => {
        setShowMap(false);
    };

    const handlePress = (e) => {
        let clientX, clientY;
        const imgElement = e.target;

        if (e.type === 'mousedown') {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e.type === 'touchstart') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        const rect = imgElement.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;

        const originX = (offsetX / imgElement.clientWidth) * 100;
        const originY = (offsetY / imgElement.clientHeight) * 100;

        imgElement.style.transform = 'scale(3)';
        imgElement.style.transformOrigin = `${originX}% ${originY}%`;
    };

    const handlePressRelease = (e) => {
        // delete the zoom in process
        e.target.style.transform = 'none';
    };

    const handleGlobalId = (action)=>{
        if (action==="previous"){
            setGlobalId("01010101");
        }else if (action==="next"){
            setGlobalId("01010102");
        }
        

    }

    return (
        <>
            {content && (
                <div className='d-flex flex-column h-100'>
                    <div className='content-image'>
                        {content.image_urls.length > 1 ?
                            <Carousel interval={5000} pause={false}>
                                {content.image_urls.map((url, index) => (
                                    <Carousel.Item key={index}>
                                        <img
                                            className="d-block w-100 h-100"
                                            src={`${process.env.PUBLIC_URL}/images/general/${url}`}
                                            alt={`carousel-item-${index}`}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel> :
                            <img
                                className="d-block w-100"
                                src={`${process.env.PUBLIC_URL}/images/general/${content.image_urls[0]}`}
                                alt={`${content.name}`}
                            />
                        }
                    </div>


                    <div className='content-title'>
                        <div className='d-flex align-items-center' onClick={()=>{handleGlobalId("previous")}}>
                            <div className="arrow arrow-left"></div>
                            <div className="arrow arrow-left-cover"></div>
                        </div>
                        {content.name}
                        <div className='d-flex align-items-center' onClick={()=>{handleGlobalId("next")}}>
                            <div className="arrow arrow-right-cover"></div>
                            <div className="arrow arrow-right"></div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between' style={{ overflowY: "scroll", height: '100%' }}>
                        <div className='content-content' style={{ borderRight: '1px solid' }}>
                            <img src={`${process.env.PUBLIC_URL}/images/general/${content.brand_url}`} alt={`${content.name}`} style={{ width: '70%', padding: '0 1rem 1rem 1rem' }} />
                            <br />
                            <span>{content.left_description}</span>
                        </div>
                        <div className='content-content'>
                            <span> {content.right_description}</span>
                            {content.map_urls.length > 0 && content.map_urls.map((map, index) => (
                                <button className='btn-map' onClick={() => handleMapClick(map.name ? map.name : content.name + " map", map.url)} key={index}> {map.name ? map.name : "See Map"}</button>
                            ))}
                        </div>
                    </div>
                    {showMap && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                width: '100vw',
                                height: '100vh',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                zIndex: 100
                            }}
                            onClick={() => hideMap()}
                        >
                            <div>
                                <div className='map-header'>
                                    <span>&nbsp;</span>
                                    <span>{mapName}</span>
                                    <span>X</span>
                                </div>
                                <div className='map-content' style={{
                                    overflow: 'hidden',
                                    width: '100vw',
                                    height: '78.3vw',
                                }}>
                                    <img
                                        src={mapUrl}
                                        alt="Map"
                                        style={{
                                            width: '100vw',
                                            height: '78.3vw',
                                            maxHeight: '78.3vw',
                                            margin: 'auto',
                                            top: '0',
                                            zIndex: 200,
                                        }}
                                        onTouchStart={handlePress} // touchscreen press
                                        onTouchEnd={handlePressRelease} // touchscreen back
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <div className='map-footer'>
                                    <span>Long Press the Map to Enlarge</span>
                                    <span>Click Outside to Exit</span>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ContentDetail;