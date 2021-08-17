import React, { Fragment } from 'react';
import {UserAlbumList, Header, Footer} from '../../components';
import { LibrarySearchbar } from '../../components';
import { useHistory } from 'react-router';
import * as Routes from '../../routes';


const UserAlbumPage = () => {
    
    const history = useHistory();
    const handleEventReadMore = (albumId) => {
    history.push(`${Routes.ALBUMS_DETAIL.replace(':id',albumId)}`);
};

    return (
        <Fragment>
            <Header/>
            <LibrarySearchbar/>
            <UserAlbumList onReadMore={handleEventReadMore} />
            <Footer/>
        </Fragment>
    )
}

export default UserAlbumPage;