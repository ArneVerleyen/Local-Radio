import React, {useEffect, useState, useCallback} from 'react';
import { useApi } from '../../services';

import './playlistList.scss';
import like from '../../static/icons/like_btn.svg';

const PlaylistList = ({children, amount, onReadMore, className, ...rest}) => {
    const { findAllPlaylists, findUserLibrary, storeUserLibrary } = useApi();
    const [playlists, setPlaylists] = useState();
    const [playlistsPage, setPlaylistsPage] = useState(1);
    const [userLib, setUserLib] = useState({
        acf: {
            playlists:[]
        }
    });

    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const token = authUser.token;
    const userID = authUser.user_id;
    
    const initFetch = useCallback(
        () => {
            const fetchPlaylists = async () => {
                const data = await findAllPlaylists(1);
                setPlaylists(data);
            };


            const fetchLib = async () => {
                const body = await findUserLibrary(userID);
                setUserLib(body[0]);
            };

            fetchLib();
            fetchPlaylists();
        }, [findAllPlaylists, findUserLibrary, userID],
    );

    const handleReadMore = (ev, playlistId) => {
        ev.preventDefault();
        if (typeof onReadMore === 'function') {
            onReadMore(playlistId);
        }
    };

    useEffect(() => {
        initFetch();
        return () => {
            // nothing to clean up
        }
    }, [initFetch])

    const handleLoadMore = async () => {
        let number = playlistsPage + 1;
        setPlaylistsPage(number);

        const data = await findAllPlaylists(number);

        if (data !== 'no more posts') {
            let newPlaylists = playlists.concat(data);
            setPlaylists(newPlaylists);
        } else {
            console.log('ran out of posts')
        };

    };

    const checkLikedPlaylist= (playlist) => { 
        const likes = userLib.acf.playlists;
        if (likes) {
            let liked = likes.includes(playlist.id);
            return liked;
        };
    };

    const unLikePlaylist = async (playlist) => {
        // Index van unliked playlist ophalen en deze uit array splicen als deze niet -1 is.
        const index = userLib.acf.playlists.indexOf(playlist.id);
        if (index !== -1) {
            userLib.acf.playlists.splice(index, 1);
            const postObj = {
                id: userLib.id,
                fields:{
                    playlists: userLib.acf.playlists,
                }
            };
            const response = await storeUserLibrary (postObj ,token, userLib.id);
            setUserLib(response);
        };
    };

    const likePlaylist = async (playlist) => {
        let postObj;
        if (!userLib.acf.playlists) {
            let playlistArray = [];
            playlistArray.push(playlist.id);
            postObj = {
                //title: userLib.title,
                id: userLib.id,
                fields: {
    
                    playlists: playlistArray,
    
                }
            };
        } else {
            userLib.acf.playlists.push(playlist.id);
            postObj = {
                //title: userLib.title,
                id: userLib.id,
                fields: {
                    playlists: userLib.acf.playlists,
                }
            };
        };

        const response = await storeUserLibrary (postObj ,token, userLib.id);
        setUserLib(response);
    };

    const checkFollowed = (playlist) => {
        const artists = userLib.acf.artists;
        
        if (Array.isArray(artists)) {
            let followed = artists.includes(playlist.acf.user_id.ID);
            return followed;
        } else if ( artists === playlist.acf.user_id.ID) {
            return true;
        };
    };  

    const follow = async (playlist) => {
        let followed = [];
        if (Array.isArray(userLib.acf.artists)) {
            followed = userLib.acf.artists;
            followed.push(parseInt(playlist.acf.user_id.ID));
        } else if (isNaN(userLib.acf.artists)) {
            followed.push(parseInt(userLib.acf.artists));
            followed.push(parseInt(playlist.acf.user_id.ID));
        } else {
            followed.push(parseInt(playlist.acf.user_id.ID)); 
        };

        const postObj = {
            id: userLib.id,
            fields: {
                artists: followed,
            }
        };

        const response = await storeUserLibrary (postObj ,token, userLib.id);
        setUserLib(response);
    };

    const unFollow = async (playlist) => {
        if (Array.isArray(userLib.acf.artists)) {
            const index = userLib.acf.artists.indexOf(playlist.acf.user_id.ID);
            if (index !== -1) {
                userLib.acf.artists.splice(index, 1)
                const postObj = {
                    id: userLib.id,
                    fields:{
                        artists: userLib.acf.artists,
                    }
                };
                const response = await storeUserLibrary (postObj ,token, userLib.id);
                setUserLib(response);
            };
        };

        if (!isNaN(userLib.acf.artists)) {

            if (userLib.acf.artists === playlist.acf.user_id.ID) {
                const postObj = {
                    id: userLib.id,
                    fields:{
                        artists: false,
                    }
                };
                const response = await storeUserLibrary (postObj ,token, userLib.id);
                setUserLib(response);
            }
        };

    };



    return(
        <div className="playlists-container">
            {playlists && playlists.map((playlist, index) => (
                <div className='playlist-container' key={index}>
                    <div className='playlist-text'>
                        <div>
                            Title: {playlist.title.rendered}
                        </div>
                        <div>
                            {playlist.acf.description &&
                                <p>Description: {playlist.acf.description}</p>
                            }
                        </div>
                        <div>
                            <button className='listen-to-playlist' onClick={(ev) => handleReadMore(ev, playlist.id)} >
                                Listen to playlist
                            </button>
                        </div>
                        {!!userLib ? 
                                <div>
                                    {
                                        checkFollowed(playlist) &&
                                        <button className='follow' onClick={() => unFollow(playlist)}>
                                            unfollow artist
                                        </button>
                                    }
                                    {
                                                                    
                                        !checkFollowed(playlist) &&
                                        <button className='follow' onClick={() => follow(playlist)}>
                                           follow artist
                                        </button>
                                    }
                                </div>
                                :<div></div>
                        }
                        <div className='like-location-container'>

                        {!!userLib ? 
                                <div>
                                    {
                                        checkLikedPlaylist(playlist) &&
                                        <button id='unlike' onClick={() => unLikePlaylist(playlist)}>
                                            Unlike
                                        </button>
                                    }
                                    {
                                                                    
                                        !checkLikedPlaylist(playlist) &&
                                        <button onClick={() => likePlaylist(playlist)}>
                                            <img alt='like' className='' src={like} />
                                        </button>
                                    }
                                </div>
                                :<div></div>
                            }
                            {playlist.acf.latitude &&
                                <div>
                                    From:
                                </div>
                            }
                        </div>
                    </div>
                </div>
            ))}
             <button id='load' onClick={handleLoadMore} >Load More</button>
        </div>
    );
};

export default PlaylistList;