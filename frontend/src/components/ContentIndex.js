import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext.js';

const ContentIndex = ({ globalId, setGlobalId }) => {

    const [displayList, setDisplayList] = useState([]);
    const [displayType, setDisplayType] = useState(""); //overlay or sidebar 
    const [displayHeadName, setDisplayHeadName] = useState(""); // the name shown onn top
    const { generalData } = useContext(AppContext);

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
        } else if (globalId.substring(4, 8) === '0000') {
            const generalData1 = generalData.find(data => data.global_id === globalId.substring(0, 2) + '000000');
            const tempData = generalData1.attributes.find(data => data.global_id === globalId.substring(0, 4) + '0000');
            setDisplayList(tempData.attributes);
            setDisplayType(tempData.attributes_inner);
            setDisplayHeadName(tempData.name);
        } else if (globalId.substring(6, 8) === '00') {
            const generalData2 = generalData.find(data => data.global_id === globalId.substring(0, 2) + '000000').attributes.find(data => data.global_id === globalId.substring(0, 4) + '0000');
            const tempData = generalData2.attributes.find(data => data.global_id === globalId.substring(0, 6) + '00');
            setDisplayList(tempData.attributes);
            setDisplayType(tempData.attributes_inner);
            setDisplayHeadName(tempData.name);
        }

    }, [generalData, globalId])

    return (
        <>
            {(globalId.substring(2, 8) !== '000000' || displayType === "sidebar") && <div className='upper-caption'>{displayHeadName}</div>}
            <div className='content-list' style={{ flexDirection: 'column' }}>
                {displayList && displayType && displayType === "overlay" && displayList.map((item, index) => (
                    <div key={index} style={{ position: 'relative' }} onClick={() => { setGlobalId(item.global_id) }}>
                        {item.image_url &&
                            <img style={{ width: '100%', height: '28vw' }} src={`${process.env.PUBLIC_URL}/images/general/${item.image_url}`} alt={item.name} />}
                        <p className='index-caption'>{item.name}</p>
                    </div>
                ))}

                {displayList && displayType && displayType === "sidebar" && displayList.map((item, index) => (
                    <div key={index} onClick={() => { setGlobalId(item.global_id) }} className='sidebar-view'>
                        {item.brand_url &&
                            <img src={`${process.env.PUBLIC_URL}/images/general/${item.brand_url}`} alt={item.name} style={{ width: '20.8vw', height: "13.8vw" }} />}
                        <span>
                            <span className='sidebar-caption-large'>{item.name}</span>
                            <br />
                            <span className='sidebar-caption-small'>{item.description}</span>
                        </span>

                    </div>
                ))}
            </div>
            <div className='content-wrapper'></div>


        </>
    )
}

export default ContentIndex;