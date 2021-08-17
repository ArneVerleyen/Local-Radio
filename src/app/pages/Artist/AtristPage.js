import React from 'react';
import * as Routes from '../../routes';
import {Link, useHistory} from 'react-router-dom';
import './artistPage.scss';
import { Header, Footer, HeaderImage } from '../../components';


import upload from '../../static/icons/upload_white.svg';
import plus from '../../static/icons/plus_white.svg';

const ArtistPage = () => {

    let user = JSON.parse(localStorage.getItem('authUser'));
    let history = useHistory();
    if (!user) {
        history.push(Routes.HOME)
    }

    return (
        <div className='artist-page-container'>
            <Header/>
            <HeaderImage/>
                    
            <div className='artist-page-content'>
                <Link to={Routes.UPLOAD_SONG}>
                    <img src={upload} alt='Upload song'/>
                    <p>Upload song</p>
                </Link>
                <Link to={Routes.UPLOAD_ALBUM}>
                    <img src={upload} alt='Upload album'/>
                    <p>Upload Album</p>
                </Link>
                <Link to={Routes.MAKE_PLAYLIST}>
                    <img src={plus} alt='Upload playlist'/>
                    <p>Make Playlist</p>
                </Link>
                <Link to={Routes.MAKE_RADIO}>
                    <img src={plus} alt='Upload radio'/>
                    <p>Make radio broadcast</p>
                </Link>
                <Link to={Routes.EDIT_ARTIST_PROFILE}>
                    <p className='editartist'>Edit artist profile</p>
                </Link>
            </div>

            <Footer/>
        </div>
    );
}

export default ArtistPage;