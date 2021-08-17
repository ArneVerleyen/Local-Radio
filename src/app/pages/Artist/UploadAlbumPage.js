import React from 'react';
import { Header, Footer, /*AlbumUpload,*/ AlbumUploadWithRel } from '../../components';
import * as Routes from '../../routes';
import { useHistory} from 'react-router-dom';
// import './uploadSongPage.scss';

const UploadAlbumPage = () => {
    let user = JSON.parse(localStorage.getItem('authUser'));
    let history = useHistory();
    if (!user) {
        history.push(Routes.HOME)
    }
    return (
        <div className='UploadAlbumPage-container'>
            <Header/>

            <AlbumUploadWithRel/>

            <Footer/>
        </div>
    );
}

export default UploadAlbumPage;