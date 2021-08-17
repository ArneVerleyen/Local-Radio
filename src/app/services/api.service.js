import React, {useContext, createContext} from 'react';
import {apiConfig} from '../config';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {

    const BASE_URL = `${apiConfig.baseURL}`;

    /*
     * SONGS
     */

    const findAllSongs = async (query) => {
        let url = `${BASE_URL}/wp-json/wp/v2/nummers`;
        if (query !== 0) {
          url = url + `/?page=${query}`;
        }
        const response = await fetch(url);
        if(response.status === 200) {
            return response.json();
        } else {
            return 'no more posts';
        };  
    };

    const findAllSongsNotPaged = async (query) => {
        let url = `${BASE_URL}/wp-json/wp/v2/nummers`;

        const response = await fetch(url); 
        return response.json();
    }

    const findSong = async (id) => {
        let url = `${BASE_URL}/wp-json/wp/v2/nummers/${id}`;
        const response = await fetch(url);
        return response.json();
    } 

    const storeMediaSong = async (token, songForm) => {

        const options = {
          method: "POST",
          headers: {
            //'Accept': 'application/json',
            //'Content-Type': 'audio/mpeg',
            'Authorization': 'Bearer'+ token
          },
          body: songForm
        }
        
        let url = `${BASE_URL}/wp-json/wp/v2/media`;
        const response = await fetch(url, options);
        
        return response.json();
    }


    const storeMediaPicture = async (token, pictureForm) => {

        const options = {
          method: "POST",
          headers: {
            //'Accept': 'application/json',
            //'Content-Type': 'audio/mpeg',
            'Authorization': 'Bearer'+ token
          },
          body: pictureForm
        };
    
        let url = `${BASE_URL}/wp-json/wp/v2/media`;
        const response = await fetch(url, options);
        
        return response.json();
    }

    const storeSong = async (body, token) => {
        const options = {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer'+ token
          },
          body: JSON.stringify(body)
        };
    
        let url = `${BASE_URL}/wp-json/wp/v2/nummers`;
        const response = await fetch(url, options);
        return response.json();
    }

    /*
     * ALBUMS
     */
    const findAllAlbumsNotPaged = async (query) => {
        let url = `${BASE_URL}/wp-json/wp/v2/album`;

        const response = await fetch(url);
        return response.json();
    };

    const findAllAlbums = async (query) => {
        let url = `${BASE_URL}/wp-json/wp/v2/album`;
        if (query !== 0) {
            url = url + `/?page=${query}`;
          }
        const response = await fetch(url);

        if(response.status === 200) {
            return response.json();
        } else {
            return 'no more posts';
        };
    };

    const storeAlbum = async (body, token) => {

        const options = {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer'+ token
          },
          body: JSON.stringify(body)
        };
    
        let url = `${BASE_URL}/wp-json/wp/v2/album`;
        const response = await fetch(url, options);
        return response.json();
    };

    const findAlbum = async (id) => {
        let url = `${BASE_URL}/wp-json/wp/v2/album/${id}`;
        const response = await fetch(url);
        return response.json();
    }; 



    /*
     * PLAYLISTS
     */

    const findAllPlaylists = async (query) => {
        let url = `${BASE_URL}/wp-json/wp/v2/playlists`;
        if (query !== 0) {
            url = url + `/?page=${query}`;
        }
        const response = await fetch(url);
        if(response.status === 200) {
            return response.json();
        } else {
            return 'no more posts';
        };
    };

    const findPlaylist = async (id) => {
        let url = `${BASE_URL}/wp-json/wp/v2/playlists/${id}`;
        const response = await fetch(url);
        console.log(response)
        if (response.status === 200) {
            return response.json();
        };
    };

    const storePlaylist = async (body, token) => {

        const options = {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer'+ token
          },
          body: JSON.stringify(body)
        };
    
        let url = `${BASE_URL}/wp-json/wp/v2/playlists`;
        const response = await fetch(url, options);
        return response.json();
    };


    /*
     * USERLIBRARY
     */

     // ?=include

    const findUserLibraries = async (query = null) => {
        let url = `${BASE_URL}/wp-json/wp/v2/user_library`;
        if (query !== null) {
          url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(query);
        }

        const response = await fetch(url);
        if(response.status === 200) {
            return response.json();
        } else {
            return 'no more posts';
        };
    };
    
    const storeUserLibrary = async (userLib, token, id) => {

        const options = {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer'+ token
          },
          body: JSON.stringify(userLib)
        };
    
        let url = `${BASE_URL}/wp-json/wp/v2/user_library/${id}`;
        const response = await fetch(url, options);
        return response.json();
    };

    const findUserLibrary = async (id) => {
        let url = `${BASE_URL}/wp-json/wp/v2/user_library/?user_id=${id}`;
        const response = await fetch(url);
        return response.json();
    };

    const queryParams = (options) => {
        return Object.keys(options)
          .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(options[key])).join('&');
    };

    const findUser = async (id) => {
        let url = `${BASE_URL}/wp-json/wp/v2/users/${id}`;
        const response = await fetch(url);
        return response.json();
    };

    return (
        <ApiContext.Provider value={{
            findAllSongs,
            findAllAlbums,
            findAllPlaylists,
            findUserLibraries,
            storeSong,
            storeMediaSong,
            storeMediaPicture,
            storeAlbum,
            findAlbum,
            findSong,
            storeUserLibrary,
            findUserLibrary,
            findPlaylist,
            storePlaylist,
            findAllAlbumsNotPaged,
            findAllSongsNotPaged,
            findUser
            }}>
            {children}
        </ApiContext.Provider>
    )

};

export  {
    ApiProvider,
    ApiContext,
    useApi
};
