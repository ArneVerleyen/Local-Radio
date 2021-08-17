import React from 'react';
import 'bootstrap';
// Router import
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';
// scss import
import './app.scss';
// Routes + services
import * as Routes from './routes';
// imports rom pages
import {
    HomePage,
    SearchSongsPage,
    ContactPage,
    LoginPage,
    ArtistPage,
    UploadSongPage,
    AlbumsPage,
    PlaylistsPage,
    UploadAlbumPage,
    AlbumDetailPage,
    RegisterPage,
    MakePlaylistPage,
    PlaylistDetailPage,
    UserAlbumPage,
    UserSongPage,
    UserPlaylistPage,
    FollowedPage,
    ArtistSongPage,
    ArtistAlbumPage,
    ArtistPlaylistPage
} 
from './pages';
// utilities
import { PageLayout } from './layout';
import { RouteLayout } from './utilities';
// services
import {ApiProvider} from './services';
import {AuthProvider} from './services'
import { ArtistsSongs } from './components';


function App() {
  return (
    <div className="App">
        <AuthProvider>
            <Router>
                <ApiProvider>
                    <Switch>
                        <RouteLayout exact path={Routes.HOME} component={HomePage} layout={PageLayout} />

                        <RouteLayout exact path={Routes.SONGS} component={SearchSongsPage} layout={PageLayout} />
                        <RouteLayout exact path={Routes.ALBUMS} component={AlbumsPage} layout={PageLayout} />
                        <RouteLayout exact path={Routes.ALBUMS_DETAIL} component={AlbumDetailPage} layout={PageLayout} />

                        <RouteLayout exact path={Routes.PLAYLISTS} component={PlaylistsPage} layout={PageLayout} />
                        <RouteLayout exact path={Routes.PLAYLISTS_DETAIL} component={PlaylistDetailPage} layout={PageLayout} />

                        <RouteLayout exact path={Routes.CONTACT} component={ContactPage} layout={PageLayout} />

                        <RouteLayout exact path={Routes.ARTISTS} component={ArtistPage} layout={PageLayout} />
                        <RouteLayout exact path={Routes.UPLOAD_SONG} component={UploadSongPage} layout={PageLayout} />
                        <RouteLayout exact path={Routes.UPLOAD_ALBUM} component={UploadAlbumPage} layout={PageLayout} />
                        <RouteLayout exact path={Routes.MAKE_PLAYLIST} component={MakePlaylistPage} layout={PageLayout} />

                        <RouteLayout exact path={Routes.USER_ALBUM} component={UserAlbumPage} layout={PageLayout} />
                        <RouteLayout exact path={Routes.USER_PLAYLISTS} component={UserPlaylistPage} layout={PageLayout} />
                        <RouteLayout exact path={Routes.USER_SONGS} component={UserSongPage} layout={PageLayout} />

                        <RouteLayout exact path={Routes.BROADCAST_FOLLOWED_USERS} component={FollowedPage} layout={PageLayout} />
                        <RouteLayout exact path={Routes.BROADCAST_SONGS} component={ArtistSongPage} layout={PageLayout} />
                        <RouteLayout exact path={Routes.BROADCAST_ALBUMS} component={ArtistAlbumPage} layout={PageLayout} />
                        <RouteLayout exact path={Routes.BROADCAST_PLAYLISTS} component={ArtistPlaylistPage} layout={PageLayout} />

                        <RouteLayout exact path={Routes.LOGIN} component={LoginPage} layout={PageLayout} />
                        <RouteLayout exact path={Routes.REGISTER} component={RegisterPage} layout={PageLayout} />
                    </Switch>
                </ApiProvider>
            </Router>
        </AuthProvider>
    </div>
  );
}

export default App;
