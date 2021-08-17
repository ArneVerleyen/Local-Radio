import React, {useState} from 'react';
import './login.scss';
import { useHistory } from 'react-router';
import {useAuth} from '../../services';
import * as Routes from '../../routes';

const Register = () => {


    const { signup, storeUserLibrary } = useAuth();
    const [body, setBody] = useState({
        username: '',
        password:'',
        email:''
    });
    const [ role, setRole ] = useState('artist');

    let history = useHistory();

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        const data = ({
            username: body.username,
            password: body.password,
            email: body.email,
            role: role
        });

        const authUser = await signup(data);

            // const authUser = JSON.parse(localStorage.getItem('authUser')); 
            const libraryBody = {
                title : authUser.user_display_name+'\'s library',
                "status": 'publish',
                fields: {
                    user_id: authUser.user_id,
                    role: role
                }
            };
        
        
        const res = await storeUserLibrary(authUser.token, libraryBody);
        console.log(res);
        if (res) {
           history.push(Routes.HOME);
        };
    };

    /*
    if (JSON.parse(localStorage.getItem('authUser')) !== null) {

        const authUser = JSON.parse(localStorage.getItem('authUser')); 
        const libraryBody = {
            title : authUser.user_display_name+'\'s library',
            status: 'publish',
            fields: {
                user_id: authUser.user_id,
                role: role[0]
            }
        };

        console.log(authUser.token);
        const library = storeUserLibrary(authUser.token, libraryBody);
        console.log(library);
    };
    */

    const handleInputChange = (ev) => {
        setBody({
          ...body,
          [ev.target.name]: ev.target.value
        });
    };
    
      const handleSelectChange = (ev) => {
        setRole([ev.target.value]);
    };


    return (
        <div className='login-component-container'>
            <form onSubmit={(ev) => handleSubmit(ev)}>
                <div>
                    <label>
                        E-mail:
                    </label>
                    <input type='email' name='email' placeholder='email' onChange={handleInputChange} />
                </div>
                <div>
                    <label>
                        Username:
                    </label>
                    <input type='text' name='username' placeholder='username' onChange={handleInputChange} />
                </div>
                <div>
                    <label>
                        Password:
                    </label>
                    <input type='password' name='password' placeholder='password' onChange={handleInputChange} />
                </div>
                <div>
                    <label>
                        Are you an artist or just here to listen?
                    </label>
                    <select multiple={false}  name='role' id='role' onChange={handleSelectChange}>
                        <option value={'artist'}>Artist</option>
                        <option value={'luisteraar'}>Listner</option>
                    </select>
                </div>
                <button type='submit'>Register</button>
            </form>
        </div>
    );
}

export default Register;