import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth, {checkPassword} from "../api/auth.ts";
import { AccountType, Field, FieldType } from "../models.ts";
import { toast } from "react-hot-toast";
import { editUser, useUser } from "../api/users.ts";
import React, { useRef } from "react";
import { useCompany } from '../api/companies.ts'; // import the useCompany hook
import { useUnit } from '../api/units.ts'; // import the useUnit hook
import PopupForm from "../components/PopupForm.tsx";
import '../index.css';

const UserSettings = () => {
    const currentUser = useAuth();
    const userId = currentUser?.id;
    const { user: editedUser, setUser: setEditedUser } = useUser({ userId: userId });
    const { company } = useCompany({ companyId: editedUser ? editedUser.companyId : 0 });
    const { unit } = useUnit({ unitId: editedUser ? editedUser.unitId : 0 });
    const userSettingsPopup = useRef<PopupForm>();

    const handlePasswordChange = (data: {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }) => {
        if (data.newPassword !== data.confirmNewPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        if(!checkPassword(currentUser.username, data.currentPassword)) {
            toast.error("Current password is incorrect");
            return;
        }
        toast.promise(editUser({
            userId: userId,
            data: {
                username: currentUser.username,
                password: data.newPassword,
                type: currentUser.type
            }
        }), {
            loading: "Loading...",
            success: "Password changed successfully",
            error: "Failed to change password"
        });
    };

    const passwordChangeFields: Array<Field> = [
        {
            name: "Current Password",
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

    const handlePhoneNumberChange = (phoneNumber: string) => {
        setEditedUser({
            ...editedUser,
            phoneNumber: phoneNumber,
        });
    };

    const submitData = () => {
        const mobileRegex = /^06\d{8}$/;
        const internationalRegex = /^\+\d{1,4}\d{6,}$/;
        if (!(mobileRegex.test(editedUser.phoneNumber) || internationalRegex.test(editedUser.phoneNumber))) {
            toast.error("Invalid phone number format");
            return;
        }

        const userDataToUpdate = {
            phoneNumber: editedUser.phoneNumber,
            type: editedUser.type
        };

        const promise = editUser({
            userId: userId,
            data: userDataToUpdate,
        });

        toast.promise(promise, {
            loading: "Loading...",
            success: "Phone number updated",
            error: "Failed to update phone number"
        });
    };

    const handleViewIssues = () => {
        window.location.href = "/my-issues";
    };

    return (
        <>
            <NavigationHeader />
            <div className="page-content user-editor">
                <div className="page-header">
                    <h1>Edit Profile</h1>
                    <button className="apply-button button-grow-on-hover" onClick={submitData}>Apply changes</button>
                </div>
                {editedUser && (
                    <div className="user-details">
                        <div className="user-detail">
                            <p>Username</p>
                            <input type="text" className="read-only" value={editedUser.username ?? "loading..."} readOnly />
                        </div>
                        <div className="user-detail">
                            <p>Account Type</p>
                            <input type="text" className="read-only" value={AccountType[editedUser.type] ?? "loading..."} readOnly />
                        </div>
                        <div className="user-detail">
                            <p>Phone number</p>
                            <input type="tel" autoComplete="off" value={editedUser.phoneNumber ?? "loading..."} onChange={(e) => handlePhoneNumberChange(e.target.value)} />
                        </div>
                        <div className="user-detail">
                            <p>Company</p>
                            <input type="text" className="read-only" value={company ? company.name : "Loading..."} readOnly />
                        </div>
                        <div className="user-detail">
                            <p>Unit</p>
                            <input type="text" className="read-only" value={unit ? unit.name : "Loading..."} readOnly />
                        </div>
                    </div>
                )}
                <div className="user-actions">
                    <button className="view-issues-button button-grow-on-hover" onClick={handleViewIssues}>View My Submitted Issues</button>
                    <button className="change-password-button button-grow-on-hover" onClick={() => userSettingsPopup.current.show()}>Change Password</button>
                </div>
                <PopupForm
                    ref={userSettingsPopup}
                    title={"Change Password"}
                    forms={[passwordChangeFields]}
                    onSubmit={handlePasswordChange} />
            </div>
        </>
    );
}

export default UserSettings;
