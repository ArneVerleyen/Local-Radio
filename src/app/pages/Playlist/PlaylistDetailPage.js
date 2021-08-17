import React from 'react';

import { Header, Footer, PlaylistDetail, MusicSearchbar } from '../../components';

const PlaylistsPage = ({children}) => {


    return (
        <div>
            <Header/>
            <MusicSearchbar/>
            <PlaylistDetail/>
            <Footer/>
        </div>
    );
}

export default PlaylistsPage;