// import React, { useState, useEffect, useRef, useContext } from 'react';
import AppContext from '../context/AppContext.js';
import { useContext, useEffect } from 'react';

const GeneralContent = () => {
    const { generalData } = useContext(AppContext);
    useEffect(() => {
        console.log(generalData);
    }, [generalData])

    return (
        <div className="main-content" >
            {generalData[0].global_id}
        </div>
    )
}

export default GeneralContent;