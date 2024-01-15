import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth, {checkPassword} from "../api/auth.ts";
import {AccountType, Field, FieldType} from "../models.ts";
import {useRef, useState} from "react";
import {useParams} from "react-router-dom";
import Dropdown from "react-dropdown";
import {toast} from "react-hot-toast";
import {useMachines, useUserMachines} from "../api/machines.ts";
import {editUser, useUser} from "../api/users.ts";
import PageFooter from "../components/PageFooter.tsx";
import {useCompanies} from "../api/companies.ts";
import {useUnits} from "../api/units.ts";
import PopupForm from "../components/PopupForm.tsx";


const AdminUserEditor = () => {
    const userId = parseInt(useParams().userId);

    const currentUser = useAuth([AccountType.Admin]);

    const {companies} = useCompanies();

    const {user: editedUser, setUser: setEditedUser} = useUser({userId: userId});

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordControl, setNewPasswordControl] = useState("");
    const {machines} = useMachines();
    const {units} = useUnits();

    const userSettingsPopup = useRef<PopupForm>();

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
        }

        toast.promise(Promise.all(promises), {
            loading: "Loading...",
            success: "Edited user",
            error: "Failed to edit user"
        });
    };

    const handlePasswordChange = async (data: {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }) => {
        if (data.newPassword !== data.confirmNewPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }
        if (!await checkPassword(currentUser.username, data.currentPassword)) {
            toast.error("Current password is incorrect");
            return;
        }

        toast.promise(editUser({
            userId: editedUser.id,
            data: {
                username: editedUser.username,
                password: data.newPassword,
                type: editedUser.type
            }
        }), {
            loading: "Loading...",
            success: "Password changed successfully",
            error: "Failed to change password"
        });
    };

    const passwordChangeFields: Array<Field> = [
        {
            name: "Your Password",
            key: "currentPassword",
            type: FieldType.Password,
            required: true,
        },
        {
            name: "New Password",
            key: "newPassword",
            type: FieldType.Password,
            required: true,
        },
        {
            name: "Confirm New Password",
            key: "confirmNewPassword",
            type: FieldType.Password,
            required: true,
        },
    ];

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const u = {...editedUser};
        u.email = e.target.value;
        setEditedUser(u);
    };

    const emailField: Field = {
        name: "Email",
        key: "email",
        type: FieldType.Text,
        required: true,
    };

    return (
        <>
            <NavigationHeader />
            <div className={"page-content user-editor"}>
                <div className={"page-header"}>
                    <h1>Edit user</h1>
                    <button onClick={submitData}>Apply changes</button>
                </div>
                <div className="user-details">
                    {editedUser && (
                        <>
                            <div className={"user-detail"}>
                                <p>Username</p>
                                <input
                                    type={"text"}
                                    autoComplete={"off"}
                                    value={editedUser.username ?? ""}
                                    onChange={(e) => handleInput("username", e.target.value)}
                                />
                            </div>
                            <div className={"user-detail"}>
                                <p>Email</p>
                                <input
                                    type={"email"}
                                    autoComplete={"off"}
                                    value={editedUser.email ?? ""}
                                    onChange={handleEmailChange}
                                />
                            </div>
                            <div className={"user-detail"}>
                                <p>Type</p>
                                <Dropdown
                                    options={accTypes}
                                    onChange={(e) => handleInput("type", parseInt(e.value))}
                                    value={editedUser.type.toString()}
                                />
                            </div>
                            {(editedUser.type === AccountType.User) && (
                                <div className={"user-detail"}>
                                    <p>Company</p>
                                    <Dropdown
                                        options={companyData}
                                        onChange={(e) => handleInput("companyId", parseInt(e.value))}
                                        value={editedUser.companyId?.toString() ?? "None"}
                                    />
                                </div>
                            )}
                            <div className={"user-detail"}>
                                <p>Unit</p>
                                <Dropdown
                                    options={unitData}
                                    onChange={(e) => handleInput("unitId", parseInt(e.value))}
                                    value={editedUser.unitId?.toString() ?? "0"}
                                />
                            </div>
                            <button className="changepasswordbutton button-grow-on-hover" onClick={() => userSettingsPopup.current.show()}>
                                Change Password
                            </button>
                        </>
                    )}
                </div>

                <PopupForm ref={userSettingsPopup} title={"Change Password"} forms={[passwordChangeFields]} onSubmit={handlePasswordChange} />
            </div>
            <PageFooter />
        </>
    );
}

export default AdminUserEditor;