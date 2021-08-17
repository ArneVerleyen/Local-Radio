import React, { Fragment } from 'react';
import { ArtistAlbums, Footer, Header } from '../../components';

const ArtistAlbumPage = () => {
    return (
        <Fragment>
            <Header/>
            <ArtistAlbums/>
            <Footer/>
        </Fragment>
    );
};

export default ArtistAlbumPage;