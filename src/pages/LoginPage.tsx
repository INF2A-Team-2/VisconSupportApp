import React, { useState } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const LoginPage = (): JSX.Element => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleLogin = () => {
        if (username.trim() !== '' && password.trim() !== '') {
          onLogin(username, password);
        } else {
          // Handle empty fields or other validation logic here
          alert('Please enter both username and password.');
        }
    };

    const handelForgot = () => {
        alert("just try again")
    }

    const onLogin = (username: string, password: string) => {
        axios.post('http://localhost:5099/api/login', {username: username, password: password})
            .then(response => {
                const token = response.data.token;
                localStorage.setItem("token", token);
                axios.defaults.headers['Authorization'] = "Bearer: " + token;
                console.log(token);
                navigate("/")
            }).catch(err => {
                console.log(err);
        })
    }

    return <>
    <div className={"navigation-header"}>
      <img className="logo" alt="Vector" src="logo.svg" />
    </div>
    <div className={"page-content"}>
        <div className={"login-box"}>
            <div className={"field"}>
                <div className={"overlap-group"}>
                    <input className={"text-wrapper"} type="text"
                        id="username" value={username}
                        onChange={handleUsernameChange} placeholder="Username" />
                    <img className={"icon"} alt="user" src="user.svg"></img>
                </div>
                <div className={"field"}>
                    <div className={"overlap-group"}>
                        <input className={"text-wrapper"} type="password"
                            id="password" value={password}
                            onChange={handlePasswordChange} placeholder="Password"/>
                        <img className={"icon"} alt="lock" src="lock.svg"></img>
                    </div>
                    <div className={"field"}>
                        <button onClick={handleLogin} className={"login-btn"}>LOGIN</button>
                        <div className="text-wrapper-2" onClick={handelForgot}>Forgot password?</div>
                    </div>
                </div>
            </div>
        </div>
     </div>
    </>
}

export default LoginPage;
