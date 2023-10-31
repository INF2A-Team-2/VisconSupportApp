import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth, {RequestConfig, SERVER_URL} from "../api/auth.ts";
import {AccountType, User} from "../models.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import Dropdown from "react-dropdown";
import {toast} from "react-hot-toast";

const AdminUserEditor = () => {
    const userId = useParams().userId;

    useAuth([AccountType.Admin]);

    const [editedUser, setEditedUser] = useState<User>(null);

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordControl, setNewPasswordControl] = useState("");

    useEffect(() => {
        axios.get(SERVER_URL + `/api/users/${userId}`, RequestConfig()).then(response => {
            setEditedUser(response.data);
        });
    }, [userId]);

    const accTypes = [
        {
            value: "0",
            label: "Customer"
        },
        {
            value: "1",
            label: "Employee"
        },
        {
            value: "2",
            label: "Admin"
        }
    ];

    const handleInput = (p: string, v) => {
        const u = {...editedUser};
        u[p] = v;

        if (typeof(v) === "string") {
            u[p] = null;
        }

        setEditedUser(u);
    };

    const submitData = () => {
        const promise = axios.put(SERVER_URL + `/api/users/${userId}`, editedUser, RequestConfig());
        toast.promise(promise, {
            loading: "Loading...",
            success: "Edited user",
            error: "Failed to edit user"
        });
    };

    const submitPassword = () => {
        if (newPassword !== newPasswordControl) {
            toast.error("Passwords don't match");
            return;
        }

        const u = {...editedUser} as any;
        u.password = newPassword;

        const promise = axios.put(SERVER_URL + `/api/users/${userId}`, u, RequestConfig());
        toast.promise(promise, {
            loading: "Loading...",
            success: "Changed password",
            error: "Failed to change password"
        });
    };

    return <>
        <NavigationHeader/>
        <div className={"page-content user-editor"}>
            <h1>Edit user</h1>
            {editedUser !== null
                ? <>
                    <p>Username</p>
                    <input type={"text"} value={editedUser.username} onChange={(e) => handleInput("username", e.target.value)}/>
                    <p>Type</p>
                    <Dropdown options={accTypes} onChange={e => handleInput("type", parseInt(e.value))} value={editedUser.type.toString()}/>
                    <p>Phone number</p>
                    <input type={"tel"} value={editedUser.phoneNumber ?? ""} onChange={(e) => handleInput("phoneNumber", e.target.value)}/>
                    <p>Unit</p>
                    <input type={"text"} value={editedUser.unit ?? ""} onChange={(e) => handleInput("unit", e.target.value)}/>
                    <button onClick={submitData}>Save changes</button>
                    <h3>Edit password</h3>
                    <p>New password</p>
                    <input type={"password"} onChange={(e) => setNewPassword(e.target.value)}/>
                    <p>Confirm new password</p>
                    <input type={"password"} onChange={(e) => setNewPasswordControl(e.target.value)}/>
                    <button onClick={submitPassword}>Change password</button>
                </>
                : <></>}
        </div>
    </>;
};

export default AdminUserEditor;