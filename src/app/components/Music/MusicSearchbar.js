import React from 'react';
import {Link} from 'react-router-dom';
import './musicSearchbar.scss';
import * as Routes from '../../routes';

const MusicSearchbar = () => {
    return (
        <div className='MusicSearchbar-container'>
            <div>
                <Link to={Routes.SONGS} >Songs</Link>
                <Link to={Routes.ALBUMS}>Albums</Link>
                <Link to={Routes.PLAYLISTS}>Playlists</Link>
            </div>
            <div className='searchBar-music'>

            </div>
        </div>
    );
}

export default MusicSearchbar;