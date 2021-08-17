import React, { Fragment } from 'react';
import { FollowedUsers, Header, Footer } from '../../components';
import * as Routes from '../../routes';
import { useHistory } from 'react-router';

const FollowedPage = ({children}) => {

    const history = useHistory();
	const handleEventReadMore = (userId) => {
		history.push(`${Routes.BROADCAST_ALBUMS.replace(':id', userId)}`);
	};

    return (
        <Fragment>
            <Header/>
            <FollowedUsers  onReadMore={handleEventReadMore}/>
            <Footer/>
        </Fragment>

    );
};

export default FollowedPage;