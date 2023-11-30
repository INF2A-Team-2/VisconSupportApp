import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType, User} from "../models.ts";
import {useUsers} from "../api/users.ts";
import React, {useState} from "react";
import Dropdown from "react-dropdown";
import toast from "react-hot-toast";
import {createMachine} from "../api/machines.ts";


const AdminAddMachine = () => {
    useAuth([AccountType.Admin]);

    const {users} = useUsers();
    const [user, setUser] = useState<User>();
    const [machineName, setMachineName] = useState("");


    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMachineName(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.promise(createMachine({
            userId : user.id,
            name : machineName
        }), {
            loading: "Creating machine...",
            success: "Machine created",
            error: "Failed to create machine"
        }).then();
    };

    return(
    <>
    <NavigationHeader/>
        <h1>Add Machine</h1>
        <form onSubmit={handleSubmit}>
            <div className={"section"}>
                <input className={"text-wrapper"} type="text"
                       id="machineName" value={machineName}
                       onChange={handleUsernameChange} placeholder="Username" />
                <Dropdown options={users.filter(u => u.type === AccountType.User).map(u => u.username)} onChange={(e) => {
                    setUser(users.find(u => u.username === e.value));}}
                          placeholder={"User..."}/>
                <button type={"submit"}>
                    Submit
                </button>
            </div>
        </form>
    </>
    );
}

export default AdminAddMachine;