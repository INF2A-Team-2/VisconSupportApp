import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";
import TableList from "../components/TableList.tsx";
import {deleteUser, newUser, useUsers} from "../api/users.ts";

const AdminUserManager = () => {
    useAuth([AccountType.Admin]);

    const navigate = useNavigate();

    const {users, refreshUsers} = useUsers();

    const [data, setData] = useState([]);

    const getType = (t: number) => {
        switch (t) {
            case 0:
                return "Customer";

            case 1:
                return "Employee";

            case 2:
                return "Admin";

            default:
                return "None";
        }
    };

    useEffect(() => {
        const _data = [];
        users.forEach(u => {
            _data.push([
                u.id,
                u.username,
                getType(u.type),
                u.phoneNumber,
                u.unit
            ]);
        });

        setData(_data);
    }, [users]);

    const handleDelete = (userId) => {
        if (!window.confirm("Are you sure that you want to delete this user?")) {
            return;
        }

        const request = deleteUser({
            userId: userId
        });

        toast.promise(request, {
            loading: "Loading...",
            success: "Deleted user",
            error: "Failed to delete user"
        }).then(() => {
            refreshUsers();
        });
    };

    const handleEdit = (userId) => {
        navigate(`/admin/users/edit/${userId}`);
    };

    const handleNewUser = () => {
        const promise = newUser({
            username: `new_user_${Math.floor(Math.random() * 100)}`,
            password: ""
        });

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
    </>;
};

export default AdminUserManager;