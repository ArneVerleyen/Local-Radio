import React, {useState, useCallback, useEffect} from 'react';
import './makePlaylist.scss';
import {useHistory} from 'react-router-dom';
import {useApi} from '../../services';
import * as Routes from '../../routes';


const MakePlaylist = () => {

    const history = useHistory();
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const token = authUser.token;
    const userID = authUser.user_id;

    const {storePlaylist, findAllSongs,findAllAlbumsNotPaged,findAllSongsNotPaged, findAllAlbums, findUserLibrary, storeUserLibrary} = useApi();
    const [songs, setSongs] = useState();
    const [albums, setAlbums] = useState(null);
    const [playlist, setPlaylist] = useState({
        title: '',
        status:'publish',
        fields:{
            albums:[],
            songs:[],
            description:'',
            user_id: userID,
        }
    });

    const [userLib, setUserLib] = useState();



    const initFetch = useCallback(
        () => {
            const fetchSongs = async () => {
                const data = await findAllSongsNotPaged();
                setSongs(data);
            }
            const fetchAlbums = async () => {
                const data = await findAllAlbumsNotPaged();
                setAlbums(data);
            }

            const fetchLib = async () => {
                const body = await findUserLibrary(userID);
                setUserLib(body[0]);
            }
            fetchAlbums();
            fetchSongs();
            fetchLib();
        }, [findAllSongsNotPaged, findUserLibrary, userID, findAllAlbumsNotPaged],
    );

    useEffect(() => {
        initFetch();
        
        return () => {
            // nothing to clean up
        }
    }, [initFetch],)

    const checkAddedSongs = (song) => {
        const added = playlist.fields.songs;

        let add = added.includes(song.id);
        return add;
    }

    const checkAddedAlbums = (album) => {
        const added = playlist.fields.albums;

        let add = added.includes(album.id);

        return add;
    }

    const addSong = (song) => {
        playlist.fields.songs.push(song.id);
        const playlistAdd = {
            title: playlist.title,
            status: playlist.status,
            fields: {

                songs: playlist.fields.songs,
                albums: playlist.fields.albums,
                description: playlist.description,
                user_id: playlist.user_id,
            }
        }

        setPlaylist(playlistAdd);
    };

    const removeAlbum = (album) => {
        const index = playlist.fields.songs.indexOf(album.id);
        if (index !== -1) {
            playlist.fields.albums.splice(index, 1);
            const playlistRemove = {
                title: playlist.title,
                status: playlist.status,
                fields: {
    
                    songs: playlist.fields.songs,
                    albums: playlist.fields.albums,
                    description: playlist.description,
                    user_id: playlist.user_id,
                }
            }
            setPlaylist(playlistRemove);
        }
    }

    const removeSong = (song) => {
        const index = playlist.fields.songs.indexOf(song.id);
        if (index !== -1) {
            playlist.fields.songs.splice(index, 1);
            const playlistRemove = {
                title: playlist.title,
                status: playlist.status,
                fields: {
    
                    songs: playlist.fields.songs,
                    albums: playlist.fields.albums,
                    description: playlist.description,
                    user_id: playlist.user_id,
                }
            }
            setPlaylist(playlistRemove);
        }
    }

    const addAlbum = (album) => {
        playlist.fields.albums.push(album.id);
        const playlistAdd = {
            title: playlist.title,
            status: playlist.status,
            
            fields: {

                songs: playlist.fields.songs,
                albums:  playlist.fields.albums,
                description: playlist.description,
                user_id: playlist.user_id,

            }
        }
        setPlaylist(playlistAdd);
    };



    const handleInputChange = (ev) => {
        setPlaylist({
          ...playlist,
          [ev.target.name]: ev.target.value
        });
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const response = await storePlaylist(playlist, token);
        userLib.acf.artist_playlists.push(response.id);
        const userLibObj = {
            id: userLib.id,
            fields:{
                artist_playlists: userLib.acf.artist_playlists,
            }
        }

        const res = await storeUserLibrary(userLibObj, token, userLib.id);
        console.log(res);
        history.push(Routes.ARTISTS);
    }


    return (
        <div className='MakePlaylist-container'>
            <h2>Make playlist</h2>
            <form onSubmit={(ev) => handleSubmit(ev)}>
                <div>
                    <p>Title</p>
                    <input onChange={handleInputChange} type='text' name='title' placeholder='title' />
                </div>
                <div>
                    <p>Description</p>
                    <textarea onChange={handleInputChange} rows='8' type='text' name='description' placeholder='description' />
                </div>
                <button type='submit' >Make playlist</button>
            </form>

            <div>
            <h3>Songs</h3>
                {
                    songs && songs.map((song, index) =>(
                        <div className='playlist-flex' key={index}>
                            <div>
                                <div>
                                    Title: {song.title.rendered}
                                </div>
                                <div>
                                {song.acf.artist &&
                                    <p className='p-border' >Artist: {song.acf.artist}</p>
                                }
                                </div>
                            </div>
                            {!!playlist ?

                            <div>
                            {
                                !checkAddedSongs(song) &&
                                <button onClick={() => addSong(song)} >Add to playlist</button>
                            }
                            {
                                checkAddedSongs(song) &&
                                <button onClick={() => removeSong(song)} >Remove from playlist</button>
                            }
                            </div>
                            :<div></div>
                            }
                            
                        </div>
                    ))
                }
            </div>
            <div>
            <h3>Albums</h3>
                {!!albums ?
                    <div>
                    {
                        albums && albums.map((album, index) =>(
                            <div className='playlist-flex' key={index}>
                                <div>
                                    <div>
                                        Album title: {album.title.rendered}
                                    </div>
                                    <div>
                                    {album.acf.artist &&
                                        <p className='p-border' >Album artist: {album.acf.artist}</p>
                                    }
                                    </div>
                                </div>
                                {!!playlist ?

                                    <div>
                                    {
                                        !checkAddedAlbums(album) &&
                                        <button onClick={() => addAlbum(album)} >Add to playlist</button>
                                    }
                                    {
                                        checkAddedAlbums(album) &&
                                        <button onClick={() => removeAlbum(album)} >Remove from playlist</button>
                                    }
                                    </div>
                                    :<div></div>
                                }
                            </div>
                        ))
                    }
                    </div>
                :<div></div> }
            </div>
        </div>
    );
}

export default MakePlaylist;