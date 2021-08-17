import React, {useEffect, useState, useCallback} from 'react';
import { useApi } from '../../services';

import './songs.scss';
import like from '../../static/icons/like_btn.svg';

const UserSongList = ({children, amount, onReadMore, className, ...rest}) => {
    const { findAllSongs, findUserLibrary, storeUserLibrary, findSong } = useApi();
    const [songs, setSongs] = useState([]);
    const [songPage, setSongPage] = useState(1);
    const [userLib, setUserLib] = useState({
        acf: {
            songs:[]
        }
    });
    
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const token = authUser.token;
    const userID = authUser.user_id;

    const initFetch = useCallback(
            () => {

            const fetchSongLibrary = async () => {
                const body = await findUserLibrary(userID);
                setUserLib(body[0]);

                let songAr = userLib.acf.songs;
                let songsArray=[];
                
                if (songAr) {
                    for (const song of songAr) {
                        const songData = await findSong(song);
                        songsArray.push(songData);
                    };
                };

                setSongs(songsArray);
            };

            fetchSongLibrary();

        }, [findSong, findUserLibrary, userID, userLib.acf.songs],
    );

    const handleReadMore = (ev, songId) => {
        ev.preventDefault();
        if (typeof onReadMore === 'function') {
            onReadMore(songId);
        }
    };

    useEffect(() => {

        initFetch();
        return () => {
            
        }
    }, [initFetch])


    const handleLoadMore = async () => {
        let number = songPage + 1;
        setSongPage(number);

        const data = await findAllSongs(number);

        if (data !== 'no more posts') {
            let newSongs = songs.concat(data);
            setSongs(newSongs);
        } else {
            console.log('ran out of posts')
        };

    };

    const checkLikedSong = (song) => {
        const likes = userLib.acf.songs;
        if (likes) {
            let liked = likes.includes(song.id);
            return liked;
        }
    };

    const unLikeSong = async (song) => {
        // Index van unliked song ophalen en deze uit array splicen als deze niet -1 is.
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
        userLib.acf.songs.push(song.id);
        const postObj = {
            //title: userLib.title,
            id: userLib.id,
            fields: {
                songs: userLib.acf.songs,
            }
        };
        const response = await storeUserLibrary (postObj ,token, userLib.id);
        setUserLib(response);
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
                            {song.acf.artist &&
                                <p>Artist: {song.acf.artist}</p>
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
                                        checkLikedSong(song) &&
                                        <button className='unlike' onClick={() => unLikeSong(song)}>
                                            Unlike
                                        </button>
                                    }
                                    {
                                                                    
                                        !checkLikedSong(song) &&
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
           
           {/*<button id='load' onClick={handleLoadMore} >Load More</button>*/}
           {songs[0] === undefined && 
                <div>
                    <h3>Nothing here listen some music and add to library.</h3>
                </div>
             }
        </div>
    );
};

export default UserSongList;