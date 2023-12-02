import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType, Field, FieldType} from "../models.ts";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";
import TableList from "../components/TableList.tsx";
import {deleteUser, newUser, useUsers} from "../api/users.ts";
import PageFooter from "../components/PageFooter.tsx";
import PopupForm from "../components/PopupForm.tsx";

const AdminUserManager = () => {
    useAuth([AccountType.Admin]);

    const navigate = useNavigate();

    const {users, refreshUsers} = useUsers();

    const [data, setData] = useState([]);

    const userCreationPopup = useRef<PopupForm>();

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

    const handleNewUser = (data : {
        username: string,
        password: string,
        passwordControl: string,
        type: number,
        phoneNumber?: string,
        unit?: string,
    }) => {
        if (data.password !== data.passwordControl) {
            toast.error("Passwords don't match");
            return;
        }

        const phoneNumberPattern: RegExp = /^\+\d{11}$/;

        if (!phoneNumberPattern.test(data.phoneNumber))
        {
            toast.error("Invalid phone number");
            return;
        }

        const promise = newUser({
            username: data.username,
            password: data.password,
            type: data.type,
            phoneNumber: data.phoneNumber,
            unit: data.unit
        });

        toast.promise(promise, {
            loading: "Creating user...",
            success: "Created user",
            error: "Failed to create user"
        }).then(() => {
            userCreationPopup.current.show(false);
            refreshUsers();
        });
    };

    const userCreationFields: Array<Field> =  [
        {
            name: "Username",
            key: "username",
            type: FieldType.Text,
            required: true
        },
        {
            name: "Type",
            key: "type",
            type: FieldType.Selection,
            required: true,
            options: [
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
            ],
            isNumber: true
        },
        {
            name: "Phone number",
            key: "phoneNumber",
            type: FieldType.Text,
            required: false
        },
        {
            name: "Unit",
            key: "unit",
            type: FieldType.Text,
            required: false
        },
        {
            name: "Password",
            key: "password",
            type: FieldType.Password,
            required: true
        },
        {
            name: "Confirm password",
            key: "passwordControl",
            type: FieldType.Password,
            required: true
        },
    ];

    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Users</h1>
            <button onClick={() => userCreationPopup.current.show()}
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
        <PopupForm ref={userCreationPopup}
                   title={"New user"}
                   fields={userCreationFields}
                   onSubmit={handleNewUser} />
        <PageFooter />
    </>;
};

export default AdminUserManager;