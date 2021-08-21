import React from 'react';

import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl }) => {
    return(
        <div className='center ma'>
            <div className='absolute mt2'>
                <img src={imageUrl} alt='Face_Image' className='FaceImage'/>
            </div>
        </div>
    );
}

export default FaceRecognition;