import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth, {RequestConfig, SERVER_URL} from "../api/auth.ts";
import {AccountType, User} from "../models.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import Dropdown from "react-dropdown";
import {toast} from "react-hot-toast";
import {useMachines} from "../api/machine.ts";
import SelectButton from "../components/SelectButton.tsx";

const AdminUserEditor = () => {
    const userId = useParams().userId;

    useAuth([AccountType.Admin]);

    const machines = useMachines();

    const [editedUser, setEditedUser] = useState<User>(null);

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordControl, setNewPasswordControl] = useState("");

    const [selectedMachines, setSelectedMachines] = useState<Array<number>>(null);

    useEffect(() => {
        axios.get(SERVER_URL + `/api/users/${userId}`, RequestConfig()).then(response => {
            setEditedUser(response.data);
        });
    }, [userId]);

    useEffect(() => {
        axios.get(SERVER_URL + `/api/machines?userId=${userId}`, RequestConfig()).then(response => {
            setSelectedMachines(response.data.map(m => m.id));
        });
    }, [userId]);
    console.log(selectedMachines);
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

    const handleMachineInput = (id: number) => {
        if (selectedMachines.includes(id)) {
            setSelectedMachines([...selectedMachines.filter(i => i != id)]);
        } else {
            selectedMachines.push(id);
            setSelectedMachines([...selectedMachines]);
        }
    };

    const submitData = () => {
        const promises = [
            axios.put(SERVER_URL + `/api/users/${userId}`, editedUser, RequestConfig()),
            axios.put(SERVER_URL + `/api/machines/${userId}`, selectedMachines, RequestConfig())
        ];

        toast.promise(Promise.all(promises), {
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
            <div className={"page-header"}>
                <h1>Edit user</h1>
                <button onClick={submitData}>Apply changes</button>
            </div>
            {editedUser && <>
                <p>Username</p>
                <input type={"text"} value={editedUser.username} onChange={(e) => handleInput("username", e.target.value)}/>
                <p>Type</p>
                <Dropdown options={accTypes} onChange={e => handleInput("type", parseInt(e.value))} value={editedUser.type.toString()}/>
                <p>Phone number</p>
                <input type={"tel"} value={editedUser.phoneNumber ?? ""} onChange={(e) => handleInput("phoneNumber", e.target.value)}/>
                <p>Unit</p>
                <input type={"text"} value={editedUser.unit ?? ""} onChange={(e) => handleInput("unit", e.target.value)}/>
                <h3>Edit password</h3>
                <p>New password</p>
                <input type={"password"} onChange={(e) => setNewPassword(e.target.value)}/>
                <p>Confirm new password</p>
                <input type={"password"} onChange={(e) => setNewPasswordControl(e.target.value)}/>
                <button onClick={submitPassword}>Change password</button>
                {editedUser.type == AccountType.User && <h3>Machines</h3>}
                <div className={"user-editor-machines-list"}>
                    { selectedMachines !== null && editedUser?.type === AccountType.User && machines.map(m =>
                        <SelectButton key={m.id} title={m.name} value={m.id} isSelected={selectedMachines.includes(m.id)} onChange={handleMachineInput}/>
                    )}
                </div>
            </>}
        </div>
    </>;
};

export default AdminUserEditor;