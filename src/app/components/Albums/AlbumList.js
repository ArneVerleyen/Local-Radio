import React, {useEffect, useState, useCallback} from 'react';
import { useApi } from '../../services';

import './albumList.scss';
import like from '../../static/icons/like_btn.svg';

const AlbumList = ({children, amount, onReadMore, className, ...rest}) => {
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    let token;
    let userID ;
    if(authUser) {
        token = authUser.token;
        userID = authUser.user_id    
    };
    const { findAllAlbums, findUserLibrary, storeUserLibrary } = useApi();
    const [albums, setAlbums] = useState();
    const [albumPage, setAlbumPage] = useState(1);
    const [userLib, setUserLib] = useState({
        acf: {
            albums:[]
        }
    });

    const initFetch = useCallback(
            () => {
            const fetchAlbums = async () => {
                const data = await findAllAlbums(1);
                setAlbums(data);
            };

            const fetchLib = async () => {
                const body = await findUserLibrary(userID);
                setUserLib(body[0]);
            };

            fetchLib();
            fetchAlbums();
        }, [findAllAlbums, findUserLibrary, userID],
    );

    const handleReadMore = (ev, albumId) => {
        ev.preventDefault();
        if (typeof onReadMore === 'function') {
                onReadMore(albumId);
        };
    };

    useEffect(() => {
        initFetch();
        return () => {
        }
    }, [initFetch]);

    const handleLoadMore = async () => {
        let number = albumPage + 1;
        setAlbumPage(number);

        const data = await findAllAlbums(number);

        if (data !== 'no more posts') {
            let newAlbums = albums.concat(data);
            setAlbums(newAlbums);
        } else {
            console.log('ran out of posts')
        };

    };


    const checkLikedAlbum = (album) => { 
        const likes = userLib.acf.albums;
        if (likes) {
            let liked = likes.includes(album.id);
            return liked;
        };
    };

    const unLikeAlbum = async (album) => {
        // Index van unliked album ophalen en deze uit array splicen als deze niet -1 is.
        const index = userLib.acf.albums.indexOf(album.id);
        if (index !== -1) {
            userLib.acf.albums.splice(index, 1);
            const postObj = {
                id: userLib.id,
                fields:{
                    albums: userLib.acf.albums,
                }
            };
            const response = await storeUserLibrary (postObj ,token, userLib.id);
            setUserLib(response);
        };
    };

    const likeAlbum = async (album) => {

        let likes = [];
        if (userLib.acf.albums) {
            userLib.acf.albums.push(album.id);
            likes = userLib.acf.albums;
        } else {
            likes.push(album.id);
        };

        const postObj = {
            id: userLib.id,
            fields: {
                albums: likes,
            }
        }
        const response = await storeUserLibrary (postObj ,token, userLib.id);
        setUserLib(response);
    };

    const checkFollowed = (album) => {
        const artists = userLib.acf.artists;
        
        if (Array.isArray(artists)) {
            let followed = artists.includes(album.acf.user_id.ID);
            return followed;
        } else if ( artists === album.acf.user_id.ID) {
            return true;
        };
    };  

    const follow = async (album) => {
        let followed = [];
        if (Array.isArray(userLib.acf.artists)) {
            followed = userLib.acf.artists;
            followed.push(parseInt(album.acf.user_id.ID));
        } else if (isNaN(userLib.acf.artists)) {
            followed.push(parseInt(userLib.acf.artists));
            followed.push(parseInt(album.acf.user_id.ID));
        } else {
            followed.push(parseInt(album.acf.user_id.ID)); 
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

    const unFollow = async (album) => {
        if (Array.isArray(userLib.acf.artists)) {
            const index = userLib.acf.artists.indexOf(album.acf.user_id.ID);
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

            if (userLib.acf.artists === album.acf.user_id.ID) {
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
                        <div className='title'>
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
                        {!!userLib ? 
                                <div>
                                    {
                                        checkFollowed(album) &&
                                        <button className='follow' onClick={() => unFollow(album)}>
                                            unfollow artist
                                        </button>
                                    }
                                    {
                                                                    
                                        !checkFollowed(album) &&
                                        <button className='follow' onClick={() => follow(album)}>
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
                                        checkLikedAlbum(album) &&
                                        <button className='unlike' onClick={() => unLikeAlbum(album)}>
                                            Unlike
                                        </button>
                                    }
                                    {
                                                                    
                                        !checkLikedAlbum(album) &&
                                        <button onClick={() => likeAlbum(album)}>
                                            <img alt='like' className='' src={like} />
                                        </button>
                                    }
                                </div>
                                :<div></div>
                            }
                            {album.acf.latitude &&
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

export default AlbumList;