import React, { useState, useEffect, Fragment, useCallback } from 'react';

import {useApi} from '../../services';
import {useParams, useHistory} from 'react-router-dom';
import like from '../../static/icons/like_btn.svg';
import * as Routes from '../../routes';
import './playlistDetail.scss';

const PlaylistDetail = () => {

    const { id } = useParams();
	const { findPlaylist, findSong, findAlbum } = useApi();
    const [ playlist, setPlaylist ] = useState();
    const [ songs, setSongs ] = useState();
    const [ albums, setAlbums ] = useState();


    const initFetch = useCallback (
        () => {

            const fetchPlaylist = async () => {
                const data = await findPlaylist(id);
                setPlaylist(data);
                let albumAr = data.acf.albums;
                let songAr = data.acf.songs;
                
                let albumsArray=[];
                let songsArray=[];
                for (const album of albumAr) {
                    const albumData = await findAlbum(album);
                    albumsArray.push(albumData);

                }
                for (const song of songAr) {
                    const songData = await findSong(song);
                    songsArray.push(songData);
                }

                setAlbums(albumsArray);
                setSongs(songsArray);

            };

            //fetchAlbums();
            fetchPlaylist();
        }, [findPlaylist, id, findSong, findAlbum]
    );

	useEffect(() =>{

        initFetch()

		return () => {

		}
	}, [initFetch]);
    const history = useHistory();
	const handleEventReadMore = (albumId) => {
		history.push(`${Routes.ALBUMS_DETAIL.replace(':id',albumId)}`);
    };
    
    const handleReadMore = (ev, albumId) => {
        ev.preventDefault();
        if (typeof onReadMore === 'function') {
                handleEventReadMore(albumId);
            }
    };

    return (
        <Fragment>
            {!!playlist
            ?   <div className='playlist-detail'>
                    <div>
                        {playlist.acf.cover &&
                            <img className='cover' src={playlist.acf.cover} alt={playlist.title.rendered} />
                        }
                        {!playlist.acf.cover &&
                            <div className='spacer'></div>
                        }
                    </div>
                    <div className='playlist-text'>
                        <div>
                            Title: {playlist.title.rendered}
                        </div>
                        <div>
                            {playlist.acf.artist &&
                                <p>Artist: {playlist.acf.artist}</p>
                            }
                        </div>
                        <div className='like-location-container'>

                            <button>
                                <img alt='like' className='' src={like} />
                            </button>
                            {playlist.acf.latitude &&
                                <div>
                                    From:
                                </div>
                            }
                        </div>
                        <div>
                            <p>Songs:</p>
                            {!!songs ? 
                            songs.map((song, index) => (
                                <audio controls key={index}>
                                    <source src={song}/>
                                    <source type='audio/mpeg'/>
                                    browser doesn't support audio.
                                </audio>
                            )):<div></div>
                            }
                        </div>
                    </div>

                </div>
                
                :<div></div>}
                            <div className="albums-container">
            {albums && albums.map((album, index) => (
                <div className='album-container' key={index}>
                    <div>
                        {album.acf.cover &&
                            <img className='cover' src={album.acf.cover} alt={album.title.rendered} />
                        }
                        {!album.acf.cover &&
                            <div className='spacer'></div>
                        }
                    </div>
                    <div className='album-text'>
                        <div>
                            Title: {album.title.rendered}
                        </div>
                        <div>
                            {album.acf.artist &&
                                <p>Artist: {album.acf.artist}</p>
                            }
                        </div>
                        <button className='listen-to-album' onClick={ev => handleReadMore(ev, album.id)}>
                            Listen to album
                        </button>
                        <div className='like-location-container'>
                            {album.acf.latitude &&
                                <div>
                                    From:
                                </div>
                            }
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </Fragment>
    );
}

export default PlaylistDetail;