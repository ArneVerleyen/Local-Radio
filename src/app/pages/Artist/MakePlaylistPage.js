import React from 'react';
import { Header, Footer, MakePlaylist } from '../../components';
import * as Routes from '../../routes';
import { useHistory} from 'react-router-dom';
// import './uploadSongPage.scss';

const MakePlaylistPage = () => {
    let user = JSON.parse(localStorage.getItem('authUser'));
    let history = useHistory();
    if (!user) {
        history.push(Routes.HOME)
    }
    return (
        <div className='MakePlaylistPage-container'>
            <Header/>

            <MakePlaylist/>

            <Footer/>
        </div>
    );
}

export default MakePlaylistPage;