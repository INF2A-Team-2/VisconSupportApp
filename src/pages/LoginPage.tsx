import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {getToken} from "../api/auth.ts";
import {toast} from "react-hot-toast";
import PageFooter from "../components/PageFooter.tsx";

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

    const handleLogin = (e: any) => {
        e.preventDefault();
        if (username.trim() !== '') {
          onLogin(username, password);
        } else {
          toast.error("Please enter username and password");
        }
    };

    const handleForgot = () => {
        toast.error("This feature has not been implemented yet");
    };

    const onLogin = (username: string, password: string) => {
        getToken(username, password).then(() => {
            navigate("/");
        }).catch(() => {
            toast.error("Invalid username or password");
        });
    };

    return <>
        <div className={"navigation-header"}>
            <img className="logo" alt="Vector" src="logo.svg" />
        </div>
        <div className={"page-content"}>
            <div className={"login-box"}>
                <form onSubmit={handleLogin}>
                    <div className={"field"}>
                        <input className={"text-wrapper"} type="text"
                            id="username" value={username}
                            onChange={handleUsernameChange} placeholder="Username" />
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className={"field"}>
                        <input className={"text-wrapper"} type="password"
                            id="password" value={password}
                            onChange={handlePasswordChange} placeholder="Password"/>
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <div>
                        <button type={"submit"} className={"login-btn"}>LOGIN</button>
                    </div>
                    <a onClick={handleForgot}>Forgot Password</a>
                </form>
            </div>
        </div>
        <PageFooter />
    </>;
};

export default LoginPage;
