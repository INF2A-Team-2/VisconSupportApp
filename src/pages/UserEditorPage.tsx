import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import { AccountType } from "../models.ts";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { editUser, useUser } from "../api/users.ts";
import { useEffect } from "react";
import axios from "axios";
import { SERVER_URL, RequestConfig } from "../api/auth.ts";

const UserEditorPage = () => {

    
    const currentUser = useAuth([AccountType.User, AccountType.Admin, AccountType.HelpDesk]);
    const requestedId = useParams().id;
    const userId = currentUser?.id;
    const { user: editedUser, setUser: setEditedUser } = useUser({ userId: userId });

    
    useEffect(() => {
        if (!currentUser) {
            axios.get(`${SERVER_URL}/account`, RequestConfig())
                .then(response => setEditedUser(response.data))
                .catch(error => console.error("Error fetching account details:", error));
        }
    }, [currentUser]);


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
    

    return <>
        <NavigationHeader />
        <div className={"page-content user-editor"}>
            <div className={"page-header"}>
                <h1>Edit Profile</h1>
                <button onClick={submitData}>Apply changes</button>
            </div>
            {editedUser && <>
            {/*TODO: Waiting for UI meeting before changing this, its not clear what is readonly and what isnt */}
                <p>Username</p>
                <input type={"text"} value={editedUser.username ?? ""} readOnly/>
                <p>Account Type</p>
                <input type={"text"} value={AccountType[editedUser.type] ?? ""} readOnly/>
                <p>Phone number</p>
                <input type={"tel"} autoComplete={"off"} value={editedUser.phoneNumber ?? ""} onChange={(e) => handlePhoneNumberChange(e.target.value)}/>
                <p>Company</p>
                <input type={"text"} value={editedUser.company ?? "COMPANY NAME TEMPORAIRY"} readOnly/>
            </>}
        </div>
    </>;
};

export default UserEditorPage;