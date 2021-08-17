import React, { Fragment } from 'react';
import { ArtistPlaylists, Footer, Header } from '../../components';

const ArtistPlaylistPage = () => {
    return (
        <Fragment>
            <Header/>
            <ArtistPlaylists/>
            <Footer/>
        </Fragment>
    );
};

export default ArtistPlaylistPage;