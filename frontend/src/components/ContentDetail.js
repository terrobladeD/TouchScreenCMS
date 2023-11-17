import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext.js';
import { Carousel } from 'react-bootstrap';

const ContentDetail = ({ globalId }) => {
    const [content, setContent] = useState(null);
    const { generalData } = useContext(AppContext);


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

    return (
        <>
            {content && (
                <div>
                    <Carousel interval={5000} pause={false}>
                        {content.image_urls.map((url, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={`${process.env.PUBLIC_URL}/images/general/${url}`}
                                    alt={`carousel-item-${index}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    <span>{content.name}</span>
                    <span>{content.left_description}</span>
                    <span>{content.right_description}</span>
                </div>
            )}
        </>
    );
};

export default ContentDetail;