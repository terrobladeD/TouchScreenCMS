import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext.js';
import ContentDetail from '../components/ContentDetail.js';
import ContentIndex from '../components/ContentIndex.js';

const nameIdMap = [{ name: 'SERVICES', icon: 'services_icon.png', globalId: '01000000' },
{ name: 'MAPS', icon: 'maps_icon.png', globalId: '02000000' },
{ name: 'ACTIVITIES', icon: 'activities_icon.png', globalId: '03000000' },
{ name: 'DESTINATIONS', icon: 'destionations_icon.png', globalId: '04000000' },
{ name: 'EVENTS', icon: 'events_icon.png', globalId: '05000000' },
{ name: 'EATING OUT', icon: 'eating_out_icon.png', globalId: '06000000' },
{ name: 'OUR HOTEL', icon: 'accomodation_icon.png', globalId: '07000000' }]

const GeneralContent = () => {
    const [globalId, setGlobalId] = useState("");
    const [leftSideBar, setLeftSideBar] = useState(null);
    const { generalData, selectedService } = useContext(AppContext);

    useEffect(() => {
        setGlobalId(nameIdMap.find(tab => tab.name === selectedService).globalId);
    }, [selectedService])

    useEffect(() => {
        if (generalData && globalId)
            setLeftSideBar(generalData.find(tab => tab.global_id === globalId.substring(0, 2) + "000000").name.toUpperCase())
    }, [generalData, globalId])


    return (

        <div className="main-content" style={{display:'flex'}}>

            {generalData && globalId && <div className='left-sidebar'>
                <p className='sidebar-caption'>{leftSideBar}</p>
            </div>}
            <div className='right-sidebar'>
                {globalId.substring(6, 8) !== "00" ? 
                <ContentDetail globalId={globalId}/> : 
                <ContentIndex globalId={globalId} setGlobalId={setGlobalId}/>}
            </div>

        </div>
    )
}

export default GeneralContent;