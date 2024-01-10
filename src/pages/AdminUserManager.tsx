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
import {useCompanies} from "../api/companies.ts";
import { useUnits } from "../api/units";


const AdminUserManager = () => {
    useAuth([AccountType.Admin]);

    const navigate = useNavigate();

    const {users, refreshUsers} = useUsers();

    const {companies} = useCompanies();

    const [data, setData] = useState([]);

    const { units } = useUnits();


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
                companies.find(c => c.id == u.companyId)?.name,
                u.phoneNumber,
                units.find(un => un.id == u.unitId)?.name,]);
        });

        setData(_data);
    }, [users, companies]);

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
        unitId?: number,
        company?: number;
    }) => {
        console.log("Received data:", data);
        if (data.password !== data.passwordControl) {
            toast.error("Passwords don't match");
            return;
        }
        if (data.unitId === 0) {
            data.unitId = null; 
        }

        const phoneNumberPattern: RegExp = /^\+\d{11}$/;

        if (!phoneNumberPattern.test(data.phoneNumber) && data.phoneNumber !== undefined)
        {
            toast.error("Invalid phone number");
            return;
        }

        if (data.company === 0)
        {
            data.company = null;
        }
        const promise = newUser({
            username: data.username,
            password: data.password,
            type: data.type,
            phoneNumber: data.phoneNumber,
            unitId: data.unitId,
            companyId: data.company
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
            name: "Company",
            key: "company",
            type: FieldType.Selection,
            required: false,
            options: [
                {
                    value: "0",
                    label: "None"
                },
                ...[...companies.map(c => { return {
                    value: c.id.toString(),
                    label: c.name
                };})]
            ],
            isNumber: true
        },
        {
            name: "Unit",
            key: "unitId",
            type: FieldType.Selection,
            required: false,
            options: [
                {
                    value: "0",
                    label: "None"
                },
                ...units.map(u => ({ value: u.id.toString(), label: u.name }))
            ],
            isNumber: true
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
            <TableList columns={["ID", "Username", "Type", "Company", "Phone number", "Unit"]}
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
                   forms={[userCreationFields]}
                   onSubmit={handleNewUser} />
        <PageFooter />
    </>;
};

export default AdminUserManager;