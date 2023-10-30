import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth, {RequestConfig, SERVER_URL} from "../api/auth.ts";
import {AccountType, User} from "../models.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";
import TableList from "../components/TableList.tsx";

const AdminUserManager = () => {
    const user = useAuth([AccountType.Admin]);

    const navigate = useNavigate();

    const [users, setUsers] = useState<Array<User>>([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const [data, setData] = useState([]);

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

    useEffect(() => {
        const _data = []
        users.forEach(u => {
            _data.push([
                u.id,
                u.username,
                getType(u.type),
                u.phoneNumber,
                u.unit
            ])
        });

        setData(_data);
    }, [users]);

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
            <h1>Users</h1>
            <TableList columns={["ID", "Username", "Type", "Phone number", "unit"]} data={data} />
        </div>
    </>
}

export default AdminUserManager;