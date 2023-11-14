// import React, { useState, useEffect, useRef, useContext } from 'react';
import AppContext from '../context/AppContext.js';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GeneralContent = () => {
    const { generalData } = useContext(AppContext);

    const { globalId } = useParams();
    useEffect(() => {
        console.log(globalId);
        console.log(generalData);
    }, [globalId, generalData])

    return (
        <div className="main-content" >
            111111111111111
        </div>
    )
}

export default GeneralContent;