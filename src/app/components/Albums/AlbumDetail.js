import React, { useState, useEffect, Fragment, useCallback } from 'react';

import {useApi} from '../../services';
import {useParams} from 'react-router-dom';


import './albumDetail.scss';

const AlbumDetail = () => {

    const { id } = useParams();
	const { findAlbum, findSong } = useApi();
    const [ album, setAlbum ] = useState();
    const [ nummersAlbum, setNummers ] = useState([]);

    const initFetch = useCallback (
        () => {
            let nummers;
            const fetchAlbum = async () => {
                const data = await findAlbum(id);
                setAlbum(data);
                nummers = data.acf.nummers;
                let numArray = [];
                for (const nummer of nummers) {
                    const data = await findSong(nummer);

                    numArray.push(data);
                }
                setNummers(numArray);
            }

            fetchAlbum();

        }, [findAlbum, id, findSong],
    );

	useEffect(() =>{

        initFetch()
		return () => {

		}
	}, [initFetch]);

    
    const filterTitle = (title) => {
        const titlename = title.replace(/[0-9]/g, '');
        const titlenameSplice = titlename.replace(/.mp|-|;|#|@|/, "");
        const titlenameSpliced = titlenameSplice.replace('#', "");
        const titleFiltered = titlenameSpliced.replace('('|'&;'|'#'|';'|')'|'.mp','');
        const titleExtraFiltered = titleFiltered.replace(/(|&;|#|;|)/,'');
        return titleExtraFiltered;
    };

    console.log(album)


    return (
        <Fragment>
            
            {!!album
            ?   <div className='album-detail'>
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
                                <p>Artist: {album.acf.user_id.display_name}</p>
                            }
                        </div>
                        <div className='like-location-container'>

                            {album.acf.latitude &&
                                <div>
                                    From:
                                </div>
                            }
                        </div>
                        <div>
                            <p>Songs:</p>
                            {!!nummersAlbum ? 
                            nummersAlbum.map((song, index) => (
                                <div  key={index}>
                                    <p>Title: {filterTitle(song.title.rendered)}</p>
                                    <audio controls>
                                        <source src={song.acf.audio.source_url}/>
                                        <source type='audio/mpeg'/>
                                        browser doesn't support audio.
                                    </audio>
                                </div>
                            )):<div></div>
                            }
                        </div>
                    </div>
                </div>
                :<div></div>}
                
        </Fragment>
        
    );
}

export default AlbumDetail;