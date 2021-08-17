import React, {useState} from 'react';
import './locationSearchbar.scss';

// eslint-disable-next-line no-unused-vars
import Geocode from 'node-open-geocoder';

import locationLogo from '../../static/icons/pin.svg';
import nodeOpenGeocoder from 'node-open-geocoder';


const LocationSearchbar = () => {


    const [locate, setGeolocation] = useState(true);
    const [locationForm, setLocationForm] = useState({
        adress: ''
    });

    let lat;
    let long;

    const getLocation = (error) => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                lat = position.coords.latitude;
                long = position.coords.longitude;
                console.log(lat, long);
            });
        } 
        else 
        {
            setGeolocation(!locate);
            console.log(locate);
        }
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        // console.log(locationForm.adress);
        nodeOpenGeocoder()
            .geocode(locationForm.adress)
            .end((err, res) => console.log(res));
    };

    const handleInputChange = (ev) => {
        setLocationForm({
            ...locationForm,
            [ev.target.name]: ev.target.value
        });
    }

    return (
        <div className='locationSearchbar-container'>
            <button onClick={getLocation} className='btn-location'>
                <img src={locationLogo} alt='location' />
                <h3>Search for L.O.C.A.L. artists</h3>
            </button>
            {!locate && <p>Geolocation is not available use the searchbar.</p>}
            <div>
                <form onSubmit={handleSubmit}>
                    <input placeholder='street, city, country' name='adress' type='text' onChange={handleInputChange}/>
                    <button type='submit' >SEARCH</button>
                </form>
            </div>
        </div>
    );
};

export default LocationSearchbar;