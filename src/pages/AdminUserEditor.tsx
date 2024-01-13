import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth, {checkPassword} from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useState} from "react";
import {useParams} from "react-router-dom";
import Dropdown from "react-dropdown";
import {toast} from "react-hot-toast";
import {useMachines, useUserMachines} from "../api/machines.ts";
import {editUser, useUser} from "../api/users.ts";
import PageFooter from "../components/PageFooter.tsx";
import {useCompanies} from "../api/companies.ts";
import {useUnits} from "../api/units.ts";

const AdminUserEditor = () => {
    const userId = parseInt(useParams().userId);

    const user = useAuth([AccountType.Admin]);

    const {companies} = useCompanies();

    const {user: editedUser, setUser: setEditedUser} = useUser({userId: userId});

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordControl, setNewPasswordControl] = useState("");
    const {machines} = useMachines();
    const {units} = useUnits();

    const unitData = [
        {
            value: "0",
            label: "None"
        },
        ...units.map(u => {
            return {
                value: u.id.toString(),
                label: u.name
            };
        })
    ];


    const {machines: selectedMachines, setMachines: setSelectedMachines} = useUserMachines({ userId: editedUser?.id });

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

    const companyData = [
        {
            value: "0",
            label: "None"
        },
        ...[...companies.map(c => { return {
            value: c.id.toString(),
            label: c.name
        };})]
    ];

    const handleInput = (p: string, v) => {
        const u = {...editedUser};
        u[p] = v;

        if (p === "companyId" && v === 0)
        {
            u[p] = null;
        }

        setEditedUser(u);
    };

    const handleMachineInput = (id: number) => {
        if (selectedMachines.map(m => m.id).includes(id)) {
            setSelectedMachines([...selectedMachines.filter(m => m.id !== id)]);
        } else {
            selectedMachines.push(machines.find(m => m.id == id));
            setSelectedMachines([...selectedMachines]);
        }
    };

    const submitData = () => {
        const promises = [
            editUser({
                userId: userId,
                data: editedUser
            }),
        ];

        if (editedUser.type === AccountType.User)
        {
            // promises.push(editUserMachines({
            //     userId: userId,
            //     data: selectedMachines.map(m => m.id)
            // }));
        }

        toast.promise(Promise.all(promises), {
            loading: "Loading...",
            success: "Edited user",
            error: "Failed to edit user"
        });
    };

    const submitPassword = async () => {
        if (!await checkPassword(user.username, oldPassword)) {
            toast.error("Invalid admin password entered!");
            return;
        }
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
                <input type={"text"} autoComplete={"off"} value={editedUser.username ?? ""} onChange={(e) => handleInput("username", e.target.value)}/>
                <p>Type</p>
                <Dropdown options={accTypes} onChange={e => handleInput("type", parseInt(e.value))} value={editedUser.type.toString()}/>
                {editedUser.type === AccountType.User && <>
                    <p>Company</p>
                    <Dropdown options={companyData} onChange={e => handleInput("companyId", parseInt(e.value))} value={editedUser.companyId?.toString() ?? "None"}/>
                </>}
                <p>Phone number</p>
                <input type={"tel"} autoComplete={"off"} value={editedUser.phoneNumber ?? ""} onChange={(e) => handleInput("phoneNumber", e.target.value)}/>
                <p>Unit</p>
                <Dropdown options={unitData} 
                      onChange={e => handleInput("unitId", parseInt(e.value))} 
                      value={editedUser.unitId?.toString() ?? "0"}/>
                <h3>Edit password</h3>
                <p>Your password</p>
                <input type={"password"} autoComplete={"old-password"} onChange={(e => setOldPassword(e.target.value))}/>
                <p>New password</p>
                <input type={"password"} autoComplete={"new-password"} onChange={(e) => setNewPassword(e.target.value)}/>
                <p>Confirm new password</p>
                <input type={"password"} autoComplete={"new-password"} onChange={(e) => setNewPasswordControl(e.target.value)}/>
                <button onClick={submitPassword}>Change password</button>
                {/*{editedUser.type == AccountType.User && <h3>Machines</h3>}*/}
                {/*<div className={"user-editor-machines-list"}>*/}
                {/*    {editedUser?.type === AccountType.User && machines.map(m =>*/}
                {/*        <SelectButton key={m.id} title={m.name} value={m.id} isSelected={selectedMachines.includes(m)} onChange={handleMachineInput}/>*/}
                {/*    )}*/}
                {/*</div>*/}
            </>}
        </div>
        <PageFooter />
    </>;
};

export default AdminUserEditor;