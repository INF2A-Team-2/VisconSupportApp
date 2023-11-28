import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useEffect, useState} from "react";
import { useContext} from "react";
import TableList from "../components/TableList.tsx";
import {useUsers} from "../api/users.ts";
import { useNavigate } from "react-router-dom";
import PageFooter from "../components/PageFooter.tsx";

const EmployeeUserList = () => {

    const currentUser = useAuth([AccountType.HelpDesk, AccountType.Admin]);

    const navigate = useNavigate();
    
    const {users, refreshUsers} = useUsers();

    const [data, setData] = useState([]);

    const ViewUserInformation = (userId) => {
        navigate(`/employee/users/${userId}`);
    };



    useEffect(() => {
        const _data = [];
        users.forEach(u => {
            _data.push([
                u.id,
                u.username,
                u.phoneNumber,
                u.unit,
            ]);
        });

        setData(_data);
    }, [users]);

    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Users</h1>
            <TableList  columns={["ID", "Username", "Phone number", "Unit"]} 
                        data={data}
                        buttons={[
                            {
                                text: <i className="fa-solid fa-arrow-right"></i>,
                                callback: (userId) => ViewUserInformation(userId)
                            }
                        ]}
                        />
            
        </div>
        <PageFooter />
    </>;
};

export default EmployeeUserList;