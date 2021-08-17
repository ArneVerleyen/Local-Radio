import React, { useState } from 'react';
import {Link, useHistory} from 'react-router-dom';
import * as Routes from '../../routes';
import './header.scss';
import { useAuth } from '../../services';



import logo from '../../static/logos/Logo_LOCAL_wit.png';
import hamburger from '../../static/icons/bars-solid-white.svg';
import close from '../../static/icons/close_white.svg';

const Header = () => {

    const [open, setOpen] = useState(false);
    const toggleTrue = () => setOpen(true);
    const toggleFalse = () => setOpen(false);
    const { logout } = useAuth();

    let history = useHistory();
    
    const handleLogout = async () =>{
        logout();
        history.push(Routes.HOME);
	}

    let user = JSON.parse(localStorage.getItem('authUser'));

    return (
        <div>
            <div className='header-large-container'>
                <div className='nav-container'>
                    <Link to={Routes.HOME} >
                        <img src={logo} alt='L.O.C.A.L. Radio'/>
                    </Link>
                    <Link to={Routes.HOME} >Home</Link>
                    <Link to={Routes.ARTISTS} >Artists</Link>
                    <Link to={Routes.CONTACT} >Contact</Link>
                    <Link to={Routes.BROADCAST_FOLLOWED_USERS} >Radio</Link>
                    <Link to={Routes.SONGS} >Music</Link>
                    {user && <Link to={Routes.USER_ALBUM} >Library</Link> }
                </div>
                <div className='login-header-container'>
                    {!user && <Link className='border' to={Routes.REGISTER} >REGISTER</Link>}
                    {!user && <Link className='border' to={Routes.LOGIN} >LOGIN</Link>}
                    {user && 
                    
                        <button onClick={handleLogout} className='border' >LOGOUT</button>
                    
                    }
                </div>
            </div>
            <div className='header-small-container'>
                <div>
                    <Link to={Routes.HOME} >
                        <img src={logo} alt='L.O.C.A.L. Radio' />
                    </Link>
                </div>
                <div>
                    {!open  &&
                        <button className='close-open-btn' onClick={toggleTrue}>
                            <img src={hamburger} alt='click here' /> 
                        </button>
                    }
                    {open &&
                        <div className="dropdown-container" >
                            <button className='close-open-btn' onClick={toggleFalse}>
                                <img src={close} alt='click here' /> 
                            </button>
                                <Link to={Routes.HOME} >Home</Link>
                                <Link to={Routes.ARTISTS} >Artists</Link>
                                <Link to={Routes.CONTACT} >Contact</Link>
                                <Link to={Routes.BROADCAST_FOLLOWED_USERS} >Radio</Link>
                                <Link to={Routes.SONGS} >Music</Link>
                                {user && <Link to={Routes.USER_ALBUM} >Library</Link> }
                                {!user && <Link className='border' to={Routes.REGISTER} >REGISTER</Link>}
                                {!user && <Link className='border' to={Routes.LOGIN} >LOGIN</Link>}
                                {user &&
                                    <button className='btn-logout' onClick={handleLogout}  >LOGOUT</button>
                                }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Header;