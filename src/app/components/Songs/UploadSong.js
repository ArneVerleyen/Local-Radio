import React,{useState} from 'react';
import {useHistory} from 'react-router-dom';
import { useApi } from '../../services';
import * as Routes from '../../routes';
import './uploadSong.scss';

const UploadSong = () => {

    let history = useHistory();

    const [metaData, setmetaData] = useState({
        title: '',
        description:'',
        artist:'',
        user_id: ''
    });


    const { storeSong } = useApi()
    const { storeMediaSong } = useApi();
    const { storeMediaPicture } = useApi();


    const handleInputChange = (ev) => {
        setmetaData({
          ...metaData,
          [ev.target.name]: ev.target.value
        });
    }

    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const token = authUser.token;

    const uploadFiles = async () => {

        let audioData
        let pictureData;

        if(document.getElementById("cover-input") !== null) {
            const coverInput = document.getElementById("cover-input");
            const pictureForm = new FormData();
            pictureForm.append("file", coverInput.files[0]);
            pictureData = await storeMediaPicture(token , pictureForm);
        };

        const audioInput = document.getElementById("audio-input");

        const songForm = new FormData();
        songForm.append("file", audioInput.files[0]);
        console.log(songForm);
        
        audioData = await storeMediaSong(token, songForm)

        let body = {
            "status":"publish",
            title: metaData.title,
            fields:{
                audio: audioData.source_url,
                description: metaData.description,
                picture: pictureData.source_url,
                artist: metaData.artist,
                user_id: authUser.user_id,
            }
        }

        return body;
    }

    const handleSubmit =  async (ev) => {

        ev.preventDefault();

        let body = await uploadFiles();

        await storeSong(body,  token);
        history.push(Routes.ARTISTS);
    };

    return(
        <div className='UploadSong-container'>
            <form onSubmit={handleSubmit} >
                <div>
                    <p>Upload file (.mp3)</p>
                    <input id='audio-input' type='file' name='audiofile'  accept=".mp3,audio/*" />
                </div>
                <div>
                    <p>Upload cover</p>
                    <input id='cover-input' type='file'  accept="image/x-png,image/gif,image/jpeg" name='coverfile'  />
                </div>
                <div>
                    <p>Title:</p>
                    <input className="input-text"  type='text' name='title' placeholder='title' onChange={handleInputChange} />
                </div>
                <div>
                    <p>Artist:</p>
                    <input className="input-text"  type='text' name='artist' placeholder='artist' onChange={handleInputChange} />
                </div>
                <div>
                    <p>Description:</p>
                    <textarea className="input-text" rows='5' type='text' name='description' placeholder='description' onChange={handleInputChange}/>
                </div>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default UploadSong;