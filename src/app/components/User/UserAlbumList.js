import React, {useEffect, useState, useCallback} from 'react';
import { useApi } from '../../services';

import './albumList.scss';
import like from '../../static/icons/like_btn.svg';

const UserAlbumList = ({children, amount, onReadMore, className, ...rest}) => {
    const { findUserLibrary, storeUserLibrary, findAlbum } = useApi();
    const [albums, setAlbums] = useState([]);
    
    const [userLib, setUserLib] = useState({
        acf: {
            albums:[]
        }
    });
    
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const token = authUser.token;
    const userID = authUser.user_id;

    const initFetch = useCallback(
            () => {

            const fetchAlbumLibrary = async () => {
                const body = await findUserLibrary(userID);
                setUserLib(body[0]);

                let albumAr = userLib.acf.albums;
                let albumsArray=[];


                if (albumAr) {
                    for (const album of albumAr) {
                        const albumData = await findAlbum(album);
                        albumsArray.push(albumData);
                    };
                };

                setAlbums(albumsArray);
            };

            fetchAlbumLibrary();

        }, [findAlbum, findUserLibrary, userID, userLib.acf.albums],
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
    }, [initFetch])


    const checkLikedAlbum = (album) => {
        const likes = userLib.acf.albums;
        if (likes) {
            let liked = likes.includes(album.id);
            return liked;
        }
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
        userLib.acf.albums.push(album.id);
        const postObj = {
            //title: userLib.title,
            id: userLib.id,
            fields: {
                albums: userLib.acf.albums,
            }
        };
        const response = await storeUserLibrary (postObj ,token, userLib.id);
        setUserLib(response);
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
             {/*<button id='load' onClick={handleLoadMore} >Load More</button>*/}
             {albums[0] === undefined && 
                <div>
                    <h3>Nothing here listen some music and add to library.</h3>
                </div>
             }
        </div>
    );
};

export default UserAlbumList;