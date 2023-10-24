import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth, {RequestConfig, SERVER_URL} from "../api/auth.ts";
import {AccountType, User} from "../models.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";

const AdminUserManager = () => {
    const user = useAuth([AccountType.Admin]);

    const navigate = useNavigate();

    const [users, setUsers] = useState<Array<User>>([])
    const [selectedUsers, setSelectedUsers] = useState([])

    useEffect(() => {
        axios.get(SERVER_URL + "/api/users", RequestConfig())
            .then(response => {
            setUsers(response.data);
        })
    }, [])

    const getType = (t: number) => {
        switch (t) {
            case 0:
                return "Customer";

            case 1:
                return "Employee";

            case 2:
                return "Admin"

            default:
                return "None"
        }
    }

    const handleSelect = (obj: EventTarget & HTMLInputElement) => {
        const id = parseInt(obj.name);

        if (selectedUsers.includes(id)) {
            setSelectedUsers([...selectedUsers.filter(i => i !== id)]);
        } else {
            setSelectedUsers([...selectedUsers.concat([id])]);
        }
    };

    const handleDelete = () => {
        const requests = selectedUsers.map(userId => {
            axios.delete(SERVER_URL + `/api/users/${userId}`, RequestConfig());
        });

        toast.promise(Promise.all(requests), {
            loading: "Loading...",
            success: `Deleted ${requests.length} ${requests.length == 1 ? "user" : "users"}`,
            error: "Failed to delete users"
        }).then(() => {
            setUsers([...users.filter(u => !selectedUsers.includes(u.id))])
            setSelectedUsers([]);
        })
    };

    const handleNewUser = () => {
        const promise = axios.post(SERVER_URL + "/api/users", {
            username: `new_user_${Math.floor(Math.random() * 100)}`,
            password: "",
        }, RequestConfig());

        toast.promise(promise, {
            loading: "Creating user...",
            success: "Created user",
            error: "Failed to create user"
        }).then(response => {
            const id = response.data.id;
            navigate(`/admin/users/edit/${id}`);
        });
    };

    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <div className={"admin-users-edit-header"}>
                <h1>Users</h1>
                <button className={"admin-users-add-user"} onClick={handleNewUser}><i className="fa-solid fa-user-plus"></i></button>
            </div>
            <div className={"admin-users-edit-header"}>
                {selectedUsers.length > 0
                ? <>
                        <p>{selectedUsers.length} {selectedUsers.length == 1 ? "item" : "items"} selected</p>
                        <a onClick={handleDelete}>Delete</a>
                    </>
                : <></>}
            </div>
            <div className={"admin-users-legenda"}>
                <p></p>
                <p></p>
                <p>Id</p>
                <p>Username</p>
                <p>Type</p>
                <p>Phone number</p>
                <p>Unit</p>
            </div>
            <div className={"admin-users-list"}>
                {users.map(u => (
                    <div className={"admin-users-list-item"} key={u.id}>
                        <input type={"checkbox"} name={u.id.toString()} onChange={(e) => handleSelect(e.target)}/>
                        <p onClick={() => navigate(`edit/${u.id}`)}>
                            <i className="fa-solid fa-pen-to-square"></i>
                        </p>
                        <p>{u.id}</p>
                        <p>{u.username}</p>
                        <p>{getType(u.type)}</p>
                        <p>{u.phoneNumber}</p>
                        <p>{u.unit}</p>
                    </div>))}
            </div>
        </div>
    </>
}

export default AdminUserManager;