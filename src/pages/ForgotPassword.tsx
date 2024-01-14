import NavigationHeader from "../components/NavigationHeader.tsx";
import PageFooter from "../components/PageFooter.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import React, {useState} from "react";
import {toast} from "react-hot-toast";
import {changePassword, submitPasswordResetRequest} from "../api/auth.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useTheme} from "../components/ThemeProvider.tsx";

const ForgotPassword = () => {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const { theme, toggleTheme } = useTheme();

    const token = searchParams.get("token");

    const [email, setEmail] = useState(null);

    const [password, setPassword] = useState(null);
    const [control, setControl] = useState(null);

    const [showConfirmation, setShowConfirmation] = useState(false);

    const onRequestNewPassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        toast.promise(submitPasswordResetRequest(email), {
            success: "Submitted request",
            error: "Failed to submit request",
            loading: "Submitting request"
        }).then(() => {
            setShowConfirmation(true);
        });
    };

    const onChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== control) {
            toast.error("Passwords don't match");
            return;
        }

        toast.promise(changePassword(token, password), {
            success: "Changed password",
            error: "Failed to change password",
            loading: "Changing password"
        }).then(() => {
            navigate("/login");
        });
    };

    const onReturn = () => {
        navigate("/login");
    };

    return <>
        <div className={"page-content"}>
            <FontAwesomeIcon
                icon={theme === 'light' ? "moon" : "sun"}
                onClick={toggleTheme}
                className={"theme-toggle-icon"}
                style={{cursor: 'pointer'}}
            />
            <img className="logo-login" alt="Vector" src="logo.svg"/>
            {token == null ? <>
                <h2 className={"forgot-password-title"}>Reset password</h2>
                <div className={"login-box"}>
                    <form onSubmit={onRequestNewPassword} >
                        <div className={"field"}>
                            <input className={"text-wrapper"} type={"email"} placeholder={"E-Mail"}
                                   onChange={e => setEmail(e.target.value)}/>
                            <i className="fa-solid fa-envelope"></i>
                        </div>
                        <button type={"submit"} className={"login-btn"}>
                            <span className={"login-text"}>Submit</span>
                        </button>
                        <div className={"forgot-password-container"}>
                            <a onClick={onReturn} className={"forgot-password-link"}>Return to login</a>
                        </div>
                    </form>
                </div>
                {showConfirmation &&
                    <p className={"forgot-password-confirmation"}>Request submitted.<br />Check your E-Mail to change your password.</p>
                }
            </> : <>
                <h2 className={"forgot-password-title"}>Reset password</h2>
                <div className={"login-box"}>
                    <form onSubmit={onChangePassword}>
                        <div className={"field"}>
                            <input className={"text-wrapper"} type={"password"} placeholder={"New password"}
                                   onChange={e => setPassword(e.target.value)}/>
                            <i className="fa-solid fa-lock"></i>
                        </div>
                        <div className={"field"}>
                            <input className={"text-wrapper"} type={"password"} placeholder={"Confirm password"}
                                   onChange={e => setControl(e.target.value)}/>
                            <i className="fa-solid fa-lock"></i>
                        </div>
                        <button type={"submit"} className={"login-btn"}>
                            <span className={"login-text"}>Submit</span>
                        </button>
                        <div className={"forgot-password-container"}>
                            <a onClick={onReturn} className={"forgot-password-link"}>Return to login</a>
                        </div>

                    </form>
                </div>
            </>}
        </div>
        <PageFooter/>
    </>;
};

export default ForgotPassword;