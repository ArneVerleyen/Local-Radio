import React from 'react';
import {useHistory} from 'react-router-dom';
import * as Routes from '../../routes';
import { Header, Footer, PlaylistList, MusicSearchbar } from '../../components';

const PlaylistsPage = ({children}) => {

    const history = useHistory();
	const handleEventReadMore = (playlistId) => {
		history.push(`${Routes.PLAYLISTS_DETAIL.replace(':id',playlistId)}`);
    };
    
    return (
        <div>
            <Header/>
            <MusicSearchbar/>
            <PlaylistList onReadMore={handleEventReadMore} />
            <Footer/>
        </div>
    );
}

export default PlaylistsPage;