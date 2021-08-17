import React, { Fragment } from 'react';
import {UserSongList, Header, Footer} from '../../components';
import { LibrarySearchbar } from '../../components';

const UserSongPage = () => {
    
    return (
        <Fragment>
            <Header/>
            <LibrarySearchbar/>
            <UserSongList/>
            <Footer/>
        </Fragment>
    )
}

export default UserSongPage;