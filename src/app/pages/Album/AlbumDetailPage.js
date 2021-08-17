import { default as React, useEffect, useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../../services';

import { AlbumDetail, Footer, Header, HeaderImage, MusicSearchbar } from '../../components';

const AlbumDetailPage = ({children}) => {

	return (
		<Fragment>
            <Header/>
            <HeaderImage/>
            <MusicSearchbar/>
			<AlbumDetail/>
            <Footer/>
		</Fragment>
	);
};

export default AlbumDetailPage;