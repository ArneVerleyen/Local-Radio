import React from 'react';
import { Header, Footer, UploadSong } from '../../components';
import './uploadSongPage.scss';
import * as Routes from '../../routes';
import { useHistory} from 'react-router-dom';

const UploadSongPage = () => {
    let user = JSON.parse(localStorage.getItem('authUser'));
    let history = useHistory();
    if (!user) {
        history.push(Routes.HOME)
    }
    return (
        <div className='UploadSongPage-container'>
            <Header/>

            <UploadSong/>

            <Footer/>
        </div>
    );
}

export default UploadSongPage;