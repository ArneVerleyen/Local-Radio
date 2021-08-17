import React, {useEffect, useState, useCallback} from 'react';
import { useApi } from '../../services';

import './playlistList.scss';
import like from '../../static/icons/like_btn.svg';

const UserPlaylistList = ({children, amount, onReadMore, className, ...rest}) => {
    const { findAllPlaylists, findUserLibrary, storeUserLibrary, findPlaylist } = useApi();
    const [playlists, setPlaylists] = useState([]);
    const [playlistPage, setPlaylistPage] = useState(1);
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

            const fetchPlaylistLibrary = async () => {
                const body = await findUserLibrary(userID);
                setUserLib(body[0]);

                let albumAr = userLib.acf.playlists;
                let playlistsArray=[];

                if (albumAr) {
                    for (const album of albumAr) {
                        const albumData = await findPlaylist(album);
                        playlistsArray.push(albumData);
                    };
                };
                
                setPlaylists(playlistsArray);
            };

            fetchPlaylistLibrary();

        }, [findPlaylist, findUserLibrary, userID, userLib.acf.playlists],
    );
        console.log(playlists)
    const handleReadMore = (ev, playlistId) => {
        ev.preventDefault();
        if (typeof onReadMore === 'function') {
            onReadMore(playlistId);
        }
    };

    useEffect(() => {

        initFetch();
        return () => {
            
        }
    }, [initFetch])


    const handleLoadMore = async () => {
        let number = playlistPage + 1;
        setPlaylistPage(number);

        const data = await findAllPlaylists(number);

        if (data !== 'no more posts') {
            let newPlaylists = playlists.concat(data);
            setPlaylists(newPlaylists);
        } else {
            console.log('ran out of posts')
        };

    };

    const checkLikedPlaylist = (playlist) => {
        const likes = userLib.acf.playlists;
        if (likes) {
            let liked = likes.includes(playlist.id);
            return liked;
        }
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
        userLib.acf.playlists.push(playlist.id);
        const postObj = {
            //title: userLib.title,
            id: userLib.id,
            fields: {
                playlists: userLib.acf.playlists,
            }
        };
        const response = await storeUserLibrary (postObj ,token, userLib.id);
        setUserLib(response);
    };

    return(
        <div className="playlists-container">
            
            {playlists[0] !== undefined && playlists.map((playlist, index) => (
                <div className='playlist-container' key={index}>
                    <div className='playlist-text'>
                        <div>
                            Title: {playlist.title.rendered}
                        </div>
                        <div>
                            {playlist.acf.artist &&
                                <p>Artist: {playlist.acf.artist}</p>
                            }
                        </div>
                        <button className='listen-to-playlist' onClick={ev => handleReadMore(ev, playlist.id)}>
                            Listen to playlist
                        </button>
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
             {/*<button id='load' onClick={handleLoadMore} >Load More</button>*/}
             {playlists[0] === undefined && 
                <div>
                    <h3>Nothing here listen some music and add to library.</h3>
                </div>
             }
        </div>
    );
};

export default UserPlaylistList;