import React,{useState, useEffect, useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import { useApi } from '../../services';
import * as Routes from '../../routes';
import './albumUpload.scss';


// content ACF omzetten in array van links voor nummers dan input naar multiple zetten api services aanpassen.
// foreach voor elk liedje in array van input files om zo up te loaden

const UploadAlbum = () => {

    let history = useHistory();

    const [userLib, setUserLib] = useState();
    const [metaData, setmetaData] = useState({
        title: '',
        description:'',
        artist:'',
        user_id: ''
    });


    const { storeAlbum, storeUserLibrary, findUserLibrary } = useApi()
    const { storeMediaSong } = useApi();
    const { storeMediaPicture } = useApi();

    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const token = authUser.token;
    const userID = authUser.user_id;

    const initFetch = useCallback(
        () => {
            const fetchLib = async () => {
                const body = await findUserLibrary(userID);
                setUserLib(body[0]);
            }
            fetchLib();
        },[findUserLibrary, userID]
    );

    useEffect(() => {
        initFetch();

        return () => {

        }
    }, [initFetch]);

    const handleInputChange = (ev) => {
        setmetaData({
          ...metaData,
          [ev.target.name]: ev.target.value
        });
    };

    const uploadFiles = async () => {

        let audioData = []; 
        let pictureData;

        if(document.getElementById("cover-input") != null) {
            const coverInput = document.getElementById("cover-input");
            const pictureForm = new FormData();
            pictureForm.append("file", coverInput.files[0]);
            pictureData = await storeMediaPicture(token , pictureForm);
        }

        const audioInput = document.getElementById("audio-input");

        const files = audioInput.files;
        for (const file of files) {
            console.log(file);
            const albumForm = new FormData();
            albumForm.append("file", file);
            let audioPath = await storeMediaSong(token, albumForm);
            
            audioData.push(audioPath.source_url);
        };

        const uploadDataAudio = audioData.toString();

        let body = {
            "status":"publish",
            title: metaData.title,
            fields:{
                nummers: uploadDataAudio,
                description: metaData.description,
                cover: pictureData.source_url,
                artist: metaData.artist,
                user_id: authUser.user_id,
            }
        }

        return body;
    };

    const handleSubmit =  async (ev) => {

        ev.preventDefault();

        let body = await uploadFiles();

        let response = await storeAlbum(body,  token);

        userLib.acf.artist_albums.push(response.id);

        const userLibObj ={
            id: userLib.id,
            fields:{
                artist_albums: userLib.acf.artist_albums,
            }
        }
        const res = await storeUserLibrary(userLibObj, token, userLib.id);
        console.log(res);
        history.push(Routes.ARTISTS);

    };

    return(
        <div className='UploadAlbum-container'>
            <form onSubmit={handleSubmit} >
                <h3>Upload Album</h3>
                <div>
                    <p>Upload song files (.mp3)</p>
                    <input id='audio-input' type='file' name='audiofile'  multiple/>
                </div>
                <div>
                    <p>Upload album cover</p>
                    <input id='cover-input' type='file' name='coverfile'  />
                </div>
                <div>
                    <p>Album title:</p>
                    <input className="input-text"  type='text' name='title' placeholder='title' onChange={handleInputChange} />
                </div>
                <div>
                    <p>Artist:</p>
                    <input className="input-text"  type='text' name='artist' placeholder='artist' onChange={handleInputChange} />
                </div>
                <div>
                    <p>Album description:</p>
                    <textarea className="input-text" rows='5' type='text' name='description' placeholder='description' onChange={handleInputChange}/>
                </div>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default UploadAlbum;