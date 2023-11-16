import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useEffect, useState} from "react";
import TableList from "../components/TableList.tsx";
import {useUsers} from "../api/users.ts";

const EmployeeUserList = () => {
    useAuth([AccountType.HelpDesk, AccountType.Admin]);

    const {users} = useUsers();

    const [data, setData] = useState([]);

    useEffect(() => {
        const _data = [];
        users.forEach(u => {
            _data.push([
                u.id,
                u.username,
                u.phoneNumber,
                u.unit
            ]);
        });

        setData(_data);
    }, [users]);;

    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Users</h1>
            <TableList columns={["ID", "Username", "Phone number", "Unit"]} data={data}/>
        </div>
    </>;
};

export default EmployeeUserList;