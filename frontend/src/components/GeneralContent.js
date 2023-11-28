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
    const [navSideBar, setNavSideBar] = useState([]);
    const { generalData, selectedService } = useContext(AppContext);

    useEffect(() => {
        setGlobalId(nameIdMap.find(tab => tab.name === selectedService).globalId);
    }, [selectedService])

    useEffect(() => {
        if (generalData && globalId) {
            setLeftSideBar(generalData.find(tab => tab.global_id === globalId.substring(0, 2) + "000000").name.toUpperCase());

            let navSideBarContent = [];
            if (globalId.substring(2, 4) !== '00') {

                const temp1Data = generalData.find(tab => tab.global_id === globalId.substring(0, 2) + "000000");
                navSideBarContent.push({ "name": temp1Data.name, "back_id": temp1Data.global_id });
                if (globalId.substring(4, 6) !== '00') {
                    const temp2Data = temp1Data.attributes.find(tab => tab.global_id === globalId.substring(0, 4) + "0000");
                    navSideBarContent.push({ "name": temp2Data.name, "back_id": temp2Data.global_id });
                    if (globalId.substring(6, 8) !== '00') {
                        const temp3Data = temp2Data.attributes.find(tab => tab.global_id === globalId.substring(0, 6) + "00");
                        navSideBarContent.push({ "name": temp3Data.name, "back_id": temp3Data.global_id });
                    }
                } else if (globalId.substring(6, 8) !== '00') {
                    const temp3Data = temp1Data.attributes.find(tab => tab.global_id === globalId.substring(0, 4) + "0000");
                    navSideBarContent.push({ "name": temp3Data.name, "back_id": temp3Data.global_id });
                }
                setNavSideBar(navSideBarContent);
            } else if (globalId.substring(6, 8) !== '00') {
                const temp0Data = generalData.find(tab => tab.global_id === globalId.substring(0, 2) + "000000");
                navSideBarContent.push({ "name": temp0Data.name, "back_id": temp0Data.global_id });
                setNavSideBar(navSideBarContent);
            } else {
                setNavSideBar([]);
            }
        }



    }, [generalData, globalId])


    return (

        <div className="main-content" style={{ display: 'flex' }}>
            {generalData && globalId && <div className='left-sidebar'>
                <div style={{ paddingTop: '1rem' }}>
                    {navSideBar.length > 0 &&
                        <div className='d-flex flex-column justify-content-center align-items-center' onClick={() => setGlobalId(navSideBar[navSideBar.length - 1].back_id)}>
                            <img src={`${process.env.PUBLIC_URL}/images/main/back_icon.png`} alt="back-button"
                                style={{ width: '50%' }} />
                            <p className='bar-index-content'>BACK</p>

                        </div>
                    }
                </div>
                <div className='center-content'>
                    <p className='sidebar-caption'>{leftSideBar}</p>
                </div>
            </div>}
            <div className='right-sidebar'>
                {globalId.substring(6, 8) !== "00" ?
                    <ContentDetail globalId={globalId} /> :
                    <ContentIndex globalId={globalId} setGlobalId={setGlobalId} />}
            </div>

        </div>
    )
}

export default GeneralContent;