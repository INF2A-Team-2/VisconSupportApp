import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useState} from "react";
import {useParams} from "react-router-dom";
import Dropdown from "react-dropdown";
import {toast} from "react-hot-toast";
import {editUserMachines, useMachines} from "../api/machines.ts";
import SelectButton from "../components/SelectButton.tsx";
import {editUser, useUser} from "../api/users.ts";

const AdminUserEditor = () => {
    const userId = parseInt(useParams().userId);

    useAuth([AccountType.Admin]);

    const {user: editedUser, setUser: setEditedUser} = useUser({userId: userId});

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordControl, setNewPasswordControl] = useState("");

    const {machines} = useMachines();

    const [selectedMachines, setSelectedMachines] = useState([]);

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
            setSelectedMachines([...selectedMachines.filter(i => i !== id)]);
        } else {
            selectedMachines.push(id);
            setSelectedMachines([...selectedMachines]);
        }
    };

    const submitData = () => {
        const promises = [
            editUser({
                userId: userId,
                data: editedUser
            }),
            editUserMachines({
                userId: userId,
                data: selectedMachines
            })
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

        const promise = editUser({
            userId: userId,
            data: u
        });
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