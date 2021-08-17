import React from 'react';
import './headerImage.scss';
import image from '../../static/images/IMG-3657.png';

const HeaderImage = () => {
    return (
        <div className='header-image-container'>
            <img src={image} alt='a majestic header' />
        </div>
    );
};

export default HeaderImage;