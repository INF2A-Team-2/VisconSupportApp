import NavigationHeader from "../components/NavigationHeader.tsx";
import PageFooter from "../components/PageFooter.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useState} from "react";
import {toast} from "react-hot-toast";
import {changePassword, submitPasswordResetRequest} from "../api/auth.ts";

const ForgotPassword = () => {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [email, setEmail] = useState(null);

    const [password, setPassword] = useState(null);
    const [control, setControl] = useState(null);

    const onRequestNewPassword = () => {
        toast.promise(submitPasswordResetRequest(email), {
            success: "Submitted request",
            error: "Failed to submit request",
            loading: "Submitting request"
        }).then(() => {
            navigate("/login");
        });
    };

    const onChangePassword = () => {
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

    return <>
        <div className={"page-content"}>
            {token == null ? <>
                <h1>Forgot password</h1>
                <p>E-Mail</p>
                <input type={"email"} onChange={e => setEmail(e.target.value)}/>
                <button onClick={onRequestNewPassword}>Submit</button>
            </> : <>
                <h1>Change password</h1>
                <p>New password</p>
                <input type={"password"} onChange={e => setPassword(e.target.value)}/>
                <p>Confirm password</p>
                <input type={"password"} onChange={e => setControl(e.target.value)}/>
                <button onClick={onChangePassword}>Change password</button>
            </>}
        </div>
        <PageFooter/>
    </>;
};

export default ForgotPassword;