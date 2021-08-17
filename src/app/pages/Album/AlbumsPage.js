import React from 'react';
import { Header, Footer, AlbumList, MusicSearchbar } from '../../components';
import {useHistory} from 'react-router-dom';
import * as Routes from '../../routes';

const AlbumsPage = ({children}) => {

    const history = useHistory();
	const handleEventReadMore = (albumId) => {
		history.push(`${Routes.ALBUMS_DETAIL.replace(':id',albumId)}`);
	};

    return (
        <div>
            <Header/>
            <MusicSearchbar/>
            <AlbumList onReadMore={handleEventReadMore}/>
            <Footer/>
        </div>
    );
}

export default AlbumsPage;