import React, { Fragment } from 'react';
import { ArtistsSongs, Footer, Header } from '../../components';

const ArtistSongPage = () => {
    return (
        <Fragment>
            <Header/>
            <ArtistsSongs/>
            <Footer/>
        </Fragment>
    );
};

export default ArtistSongPage;