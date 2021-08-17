import React from 'react';
import {Link} from 'react-router-dom';
import * as Routes from '../../routes';
import './footer.scss';

import logo from '../../static/logos/Logo_LOCAL_wit.png';

const Footer = () => {
    return (
        <div className='footer-container'>            
            <Link to={Routes.HOME} >
                <img src={logo} alt='L.O.C.A.L. Radio'/>
            </Link>
        </div>
    );
};

export default Footer;