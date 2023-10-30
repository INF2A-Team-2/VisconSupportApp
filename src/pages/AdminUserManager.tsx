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

    const handleDelete = (userId) => {
        if (!window.confirm("Are you sure that you want to delete this user?")) {
            return;
        }

        const request = axios.delete(SERVER_URL + `/api/users/${userId}`, RequestConfig());

        toast.promise(request, {
            loading: "Loading...",
            success: "Deleted user",
            error: "Failed to delete user"
        }).then(() => {
            setUsers([...users.filter(u => u.id !== userId)])
        })
    };

    const handleEdit = (userId) => {
        navigate(`/admin/users/edit/${userId}`);
    }

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
            <button onClick={handleNewUser}
                    style={{
                        width: "100px",
                        borderRadius: "4px"
                    }}>
                Add user <i className="fa-solid fa-user-plus"></i>
            </button>
            <TableList columns={["ID", "Username", "Type", "Phone number", "unit"]}
                       data={data}
                       buttons={[
                           {
                               text: <i className="fa-solid fa-pen-to-square"></i>,
                               callback: handleEdit
                           },
                           {
                               text: <i className="fa-solid fa-trash"></i>,
                               callback: handleDelete
                           }
                       ]}/>
        </div>
    </>
}

export default AdminUserManager;