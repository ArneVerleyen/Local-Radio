import React from 'react';
import './homePage.scss';

// component imports
import {
    Header,
    Footer,
    HeaderImage,
    LocationSearchbar,

} from '../components';

const HomePage = () => {
    return (
        <div>
            <Header/>
            <HeaderImage/>
            <LocationSearchbar/>
            
            <Footer/>
        </div>
    );
};

export default HomePage;