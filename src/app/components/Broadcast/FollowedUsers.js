import React, {useEffect, useState, useCallback} from 'react';
import { useApi } from '../../services';

import './followedUsers.scss';

const SongList = ({children, amount, onReadMore, className, ...rest}) => {

    const { storeUserLibrary, findUserLibrary, findUser } = useApi();
    const [userLib, setUserLib] = useState();
    const [ artists, setArtists] = useState();
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    let token;
    let userID ;

    if(authUser) {
        token = authUser.token;
        userID = authUser.user_id    
    }
    const initFetch = useCallback(
        () => {
            const fetchLib = async () => {
                const body = await findUserLibrary(userID);
                setUserLib(body[0]);
                // setArtists(body[0].acf.artists);

                
                let response = body[0].acf.artists;
                console.log(response)
                if(!isNaN(response)) {
                    
                    let artistArray = [];
                    const res = await findUser(response);
                    artistArray.push(res);
                    setArtists(artistArray);

                };
                if (typeof response === 'string') {
                    response = response.replace('[', '');
                    response = response.replace(']', '');
                    let artistId = [];
                    artistId.push(parseInt(response));
                    let artistArray = [];
    
                    for (const artist of artistId) {
                        const res = await findUser(artist);
                        console.log(res)
                        artistArray.push(res);
                    };
                    setArtists(artistArray);
                };
            };
            fetchLib();
        }, [findUser, findUserLibrary, userID],
    );

    console.log(artists);


    useEffect(() => {
        initFetch();
        
        return () => {
            // nothing to clean up
        }
    }, [initFetch],);
    /*
    const checkFollowed = (artist) => {
        const artists = userLib.acf.artists;
        console.log(artist);
        if (Array.isArray(artists)) {
            let followed = artists.includes(artist.id);
            return followed;
        } else if ( artists === artist.id) {
            return true;
        };
    };  

    const follow = async (artist) => {
        let followed = [];
        if (Array.isArray(userLib.acf.artists)) {
            followed = userLib.acf.artists;
            followed.push(parseInt(artist.id));
        } else if (isNaN(userLib.acf.artists)) {
            followed.push(parseInt(userLib.acf.artists));
            followed.push(parseInt(artist.id));
        } else {
            followed.push(parseInt(artist.id)); 
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

    const unFollow = async (artist) => {
        if (Array.isArray(userLib.acf.artists)) {
            const index = userLib.acf.artists.indexOf(artist.id);
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

            if (userLib.acf.artists === artist.id) {
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
    */

    const handleReadMore = (ev, artist) => {
        ev.preventDefault();
        if (typeof onReadMore === 'function') {
            onReadMore(artist.id);
        };
    };


    return(
        <div className="songs-container">
            {artists && artists.map((artist, index) => (
                <div className='song-container' key={index}>
                    <div className='song-text'>
                        <div>
                            Artist: {artist.name}
                        </div>
                        <button onClick={(ev) => handleReadMore(ev, artist)} className='follow' >Go to broadcast</button>
                        <div className='like-location-container'>
                           
                        {!!userLib ? 
                                <div>
                                    {/*
                                        checkFollowed(artist) &&
                                        <button className='follow' onClick={() => unFollow(artist)}>
                                            unfollow artist
                                        </button>
                                    }
                                    {
                                                                    
                                        !checkFollowed(artist) &&
                                        <button className='follow' onClick={() => follow(artist)}>
                                           follow artist
                                        </button>
                                    */}
                                </div>
                                :<div></div>
                        }   
                        </div>
                        
                    </div>  
                   
                </div>  
                
            ))}
        </div>
    );
};

export default SongList;