import React, {useEffect, useState, Fragment, useCallback} from 'react';
import  {default as classnames} from 'classnames';
import { useApi } from '../../services';

import './songs.scss';
import like from '../../static/icons/like_btn.svg';

const SongList = ({children, amount, onReadmore, className, ...rest}) => {
    const { findAllSongs } = useApi();
    const { storeUserLibrary, findUserLibrary } = useApi();
    const [songs, setSongs] = useState();
    const [userLib, setUserLib] = useState();
    const [songsPage, setSongsPage] = useState(1);
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    let token;
    let userID ;

    if(authUser) {
        token = authUser.token;
        userID = authUser.user_id    
    }
    const initFetch = useCallback(
        () => {
            const fetchSongs = async () => {
                const data = await findAllSongs(1);
                console.log(data);
                setSongs(data);
            };
            const fetchLib = async () => {
                const body = await findUserLibrary(userID);
                setUserLib(body[0]);
            };
            fetchSongs();
            fetchLib();
        }, [findAllSongs, findUserLibrary, userID],
    );



    useEffect(() => {
        initFetch();
        
        return () => {
            // nothing to clean up
        }
    }, [initFetch],)

    const checkLiked = (song) => {
        const likes = userLib.acf.songs;
        if (likes) {
            let liked = likes.includes(song.id);
            return liked;
        };
    };


    const unLikeSong = async (song) => {
        const index = userLib.acf.songs.indexOf(song.id);
        if (index !== -1) {
            userLib.acf.songs.splice(index, 1);
            const postObj = {
                id: userLib.id,
                fields:{
                    songs: userLib.acf.songs,
                }
            };
            const response = await storeUserLibrary (postObj ,token, userLib.id);
            setUserLib(response);
        };
    };

    const likeSong = async (song) => {

        let likes = [];
        if (userLib.acf.songs) {
            userLib.acf.songs.push(song.id);
            likes = userLib.acf.songs;
        } else {
            likes.push(song.id);
        };

        const postObj = {
            id: userLib.id,
            fields: {
                songs: likes,
            }
        };

        const response = await storeUserLibrary (postObj ,token, userLib.id);
        setUserLib(response);

    };

    const handleLoadMore = async () => {
        let number = songsPage + 1;
        setSongsPage(number);

        const data = await findAllSongs(number);

        if (data !== 'no more posts') {
            let newSongs = songs.concat(data);
            console.log(newSongs);
            setSongs(newSongs);
        } else {
            console.log('ran out of posts')
        };

    };

    const checkFollowed = (song) => {
        const artists = userLib.acf.artists;
        
        if (Array.isArray(artists)) {
            let followed = artists.includes(song.acf.user_id.ID);
            return followed;
        } else if ( artists === song.acf.user_id.ID) {
            return true;
        };
    };  

    const follow = async (song) => {
        let followed = [];
        if (Array.isArray(userLib.acf.artists)) {
            followed = userLib.acf.artists;
            followed.push(parseInt(song.acf.user_id.ID));
        } else if (isNaN(userLib.acf.artists)) {
            followed.push(parseInt(userLib.acf.artists));
            followed.push(parseInt(song.acf.user_id.ID));
        } else {
            followed.push(parseInt(song.acf.user_id.ID)); 
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

    const unFollow = async (song) => {
        if (Array.isArray(userLib.acf.artists)) {
            const index = userLib.acf.artists.indexOf(song.acf.user_id.ID);
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

            if (userLib.acf.artists === song.acf.user_id.ID) {
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
        <div className="songs-container">
            {songs && songs.map((song, index) => (
                <div className='song-container' key={index}>
                    <div>
                        {song.acf.picture &&
                            <img className='cover' src={song.acf.picture} alt={song.title.rendered} />
                        }
                        {!song.acf.picture &&
                            <div className='spacer'></div>
                        }
                    </div>
                    <div className='song-text'>
                        <div>
                            Title: {song.title.rendered}
                        </div>
                        <div>
                            {song.acf.user_id.display_name &&
                                <p>Artist: {song.acf.user_id.display_name}</p>
                            }
                        </div>
                        <div>
                            <audio controls>
                                <source src={song.acf.audio.source_url}/>
                                <source type='audio/mpeg'/>
                                browser doesn't support audio.
                            </audio>
                        </div>

                        <div className='like-location-container'>
                        {!!userLib ? 
                                <div>
                                    {
                                        checkFollowed(song) &&
                                        <button className='follow' onClick={() => unFollow(song)}>
                                            unfollow artist
                                        </button>
                                    }
                                    {
                                                                    
                                        !checkFollowed(song) &&
                                        <button className='follow' onClick={() => follow(song)}>
                                           follow artist
                                        </button>
                                    }
                                </div>
                                :<div></div>
                        }
                            {!!userLib ? 
                                <div>
                                    {
                                        checkLiked(song) &&
                                        <button className='unlike' onClick={() => unLikeSong(song)}>
                                            Unlike
                                        </button>
                                    }
                                    {
                                                                    
                                        !checkLiked(song) &&
                                        <button onClick={() => likeSong(song)}>
                                            <img alt='like' className='' src={like} />
                                        </button>
                                    }
                               
                                </div>
                                :<div></div>
                            }
                            {song.acf.latitude &&
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

export default SongList;