import React, {useState} from 'react';
import './login.scss';
import { useHistory } from 'react-router';
import { useAuth} from '../../services';
import * as Routes from '../../routes';

const Login = () => {


    const { signIn } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let history = useHistory();

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const user = await signIn(username, password);
        if (user !== 'wrong password') {
          history.push(Routes.HOME);
        };
        if (user === 'wrong password') {
            console.log('wrong credentials');
        }
    };

    return (
        <div className='login-component-container'>
            <form onSubmit={(ev) => handleSubmit(ev)}>
                <div>
                    <label>
                        Username:
                    </label>
                    <input type='text' name='username' placeholder='username' onChange={(ev) => setUsername(ev.target.value)} />
                </div>
                <div>
                    <label>
                        Password:
                    </label>
                    <input type='password' name='password' placeholder='password' onChange={(ev) => setPassword(ev.target.value)} />
                </div>
                <button type='submit'>Sign in</button>
            </form>
        </div>
    );
}

export default Login;