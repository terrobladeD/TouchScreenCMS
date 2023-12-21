import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext.js';

const ContentIndex = ({ globalId, setGlobalId }) => {

    const [displayList, setDisplayList] = useState([]);
    const [displayType, setDisplayType] = useState(""); //overlay or sidebar 
    const [displayHeadName, setDisplayHeadName] = useState(""); // the name shown on top
    const [displayMap, setDisplayMap] = useState(""); // to show the map on the banner
    const { generalData } = useContext(AppContext);

    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        const contentList = document.querySelector('.content-list');
        if (contentList) {
            contentList.scrollTop = 0;
        }
    }, [globalId]);

    useEffect(() => {
        // the first index
        if (globalId.substring(2, 8) === '000000') {
            const tempData = generalData.find(data => data.global_id === globalId.substring(0, 2) + '000000');
            setDisplayList(tempData.attributes);
            setDisplayType(tempData.attributes_inner);
            setDisplayHeadName(tempData.name);
            setDisplayMap(tempData.map_urls ? `${process.env.PUBLIC_URL}/images/general/${tempData.map_urls[0].url}` : "")
        } else if (globalId.substring(4, 8) === '0000') {
            const generalData1 = generalData.find(data => data.global_id === globalId.substring(0, 2) + '000000');
            const tempData = generalData1.attributes.find(data => data.global_id === globalId.substring(0, 4) + '0000');
            setDisplayList(tempData.attributes);
            setDisplayType(tempData.attributes_inner);
            setDisplayHeadName(tempData.name);
            setDisplayMap(tempData.map_urls ? `${process.env.PUBLIC_URL}/images/general/${tempData.map_urls[0].url}` : "")
        } else if (globalId.substring(6, 8) === '00') {
            const generalData2 = generalData.find(data => data.global_id === globalId.substring(0, 2) + '000000').attributes.find(data => data.global_id === globalId.substring(0, 4) + '0000');
            const tempData = generalData2.attributes.find(data => data.global_id === globalId.substring(0, 6) + '00');
            setDisplayList(tempData.attributes);
            setDisplayType(tempData.attributes_inner);
            setDisplayHeadName(tempData.name);
            setDisplayMap(tempData.map_urls ? `${process.env.PUBLIC_URL}/images/general/${tempData.map_urls[0].url}` : "")
        }

    }, [generalData, globalId])

    const handleMapShow = () => {
        setShowMap(true);
    }
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


    return (
        <>
            <div className='upper-caption'>
                {displayHeadName}
                {displayMap &&
                    <img src={`${process.env.PUBLIC_URL}/images/main/map_icon.png`} alt='map_icon'
                        style={{ width: '4rem', height: '4rem', position: 'absolute', right: "2rem" }} onClick={handleMapShow} />}

            </div>
            <div className='content-list' style={{ flexDirection: 'column' }}>
                {displayList && displayType && displayType === "overlay" && displayList.map((item, index) => (
                    <div key={index} style={{ position: 'relative' }} onClick={() => { setGlobalId(item.global_id) }}>
                        {item.image_url &&
                            <img style={{ width: '100%', height: '17.5rem' }} src={`${process.env.PUBLIC_URL}/images/general/${item.image_url}`} alt={item.name} />}
                        {item.brand_url &&
                            <img style={{ width: '100%', height: '17.5rem' }} src={`${process.env.PUBLIC_URL}/images/general/${item.brand_url}`} alt={item.name} />}
                        <p className='index-caption'>{item.name}</p>
                    </div>
                ))}

                {displayList && displayType && displayType === "sidebar" && displayList.map((item, index) => (
                    <div key={index} onClick={() => { setGlobalId(item.global_id) }} className='sidebar-view'>
                        {item.brand_url &&
                            <img src={`${process.env.PUBLIC_URL}/images/general/${item.brand_url}`} alt={item.name} style={{ width: '13rem', height: "8.625rem" }} />}
                        <span>
                            <span className='sidebar-caption-large'>{item.name}</span>
                            <br />
                            <span className='sidebar-caption-small'>{item.description}</span>
                        </span>

                    </div>
                ))}
            </div>
            <div className='content-wrapper'></div>
            {showMap && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '62.5rem',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 100
                    }}
                    onClick={() => hideMap()}
                >
                    <div>
                        <div className='map-header'>
                            <span>&nbsp;</span>
                            <span>{displayHeadName + " MAP"}</span>
                            <span>X</span>
                        </div>
                        <div className='map-content' style={{
                            overflow: 'hidden',
                            width: '62.5rem',
                            height: '48.94rem',
                        }}>
                            <img
                                src={displayMap}
                                alt="Map"
                                style={{
                                    width: '62.5rem',
                                    height: '48.94rem',
                                    maxHeight: '48.94rem',
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

        </>
    )
}

export default ContentIndex;