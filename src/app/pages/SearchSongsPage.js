import React from 'react';
import './searchSongsPage.scss';

// component imports
import {
    Header,
    Footer,
    SongList,
    MusicSearchbar,
} from '../components';

const SearchSongsPage = () => {
    return (
        <div>
            <Header/>
            <MusicSearchbar/>
            <SongList/>
            <Footer/>
        </div>
    );
};

export default SearchSongsPage;