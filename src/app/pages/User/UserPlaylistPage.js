import React, { Fragment } from 'react';
import {UserPlaylistList, Header, Footer} from '../../components';
import { LibrarySearchbar } from '../../components';
import {useHistory} from 'react-router-dom';
import * as Routes from '../../routes';

const UserPlaylistPage = () => {

    const history = useHistory();
	const handleEventReadMore = (playlistId) => {
		history.push(`${Routes.PLAYLISTS_DETAIL.replace(':id',playlistId)}`);
	};
    
    return (
        <Fragment>
            <Header/>
            <LibrarySearchbar/>
            <UserPlaylistList onReadMore={handleEventReadMore} />
            <Footer/>
        </Fragment>
    )
}

export default UserPlaylistPage;