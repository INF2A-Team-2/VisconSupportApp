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
    const currentUser = useAuth([AccountType.User, AccountType.Admin, AccountType.HelpDesk]);
    const userId = currentUser?.id;
    const { user: editedUser, setUser: setEditedUser } = useUser({ userId: userId });
    const { company } = useCompany({ companyId: editedUser ? editedUser.companyId : 0 });
    const { unit } = useUnit({ unitId: editedUser ? editedUser.unitId : 0 });
    const userSettingsPopup = useRef<PopupForm>();

    const handlePasswordChange = async (data: {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }) => {
        if (data.newPassword !== data.confirmNewPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }
        try{
            await checkPassword(currentUser.username, data.currentPassword);
        }
        catch{
            toast.error("Current password is incorrect");
            return;
        }

        toast.promise(editUser({
            userId: currentUser.id,
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



    const handleViewIssues = () => {
        window.location.href = "/my-issues";
    };

    return (
        <>
            <NavigationHeader />
            <div className="page-content user-editor">
                <div className="page-header">
                    <h1>Edit Profile</h1>
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
                            <p>Company</p>
                            <input type="text" className="read-only" value={company ? company.name : "Loading..."} readOnly />
                        </div>
                        <div className="user-detail">
                            <p>Company Phone Number</p>
                            <input type="text" className="read-only" value={company.phoneNumber ?? "Loading..."} readOnly />
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
