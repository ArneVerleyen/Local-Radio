import React from 'react';
import {Link} from 'react-router-dom';
import './musicSearchbar.scss';
import * as Routes from '../../routes';

const LibrarySearchbar = () => {
    return (
        <div className='MusicSearchbar-container'>
            <div>
                <Link to={Routes.USER_SONGS} >Songs</Link>
                <Link to={Routes.USER_ALBUM}>Albums</Link>
                <Link to={Routes.USER_PLAYLISTS}>Playlists</Link>
            </div>
            <div className='searchBar-music'>

            </div>
        </div>
    );
}

export default LibrarySearchbar;