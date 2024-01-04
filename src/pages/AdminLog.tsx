import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useLogs} from "../api/logs.ts";
import NavigationHeader from "../components/NavigationHeader.tsx";
import TableList from "../components/TableList.tsx";
import PageFooter from "../components/PageFooter.tsx";
import {useEffect, useState} from "react";
import {useUsers} from "../api/users.ts";
import dayjs from "dayjs";

const AdminLog = () => {

    const currentUser = useAuth([AccountType.Admin]);

    const {logs, refreshLogs} = useLogs([]);

    const [data , setData ] = useState([]);

    const {users} = useUsers()

    useEffect(() => {
        const _data = [];
        logs.forEach(l => {
            _data.push([
                l.id,
                dayjs(l.timeStamp).format("DD/MM/YYYY HH:mm:ss"),
                users.find(u => l.authorId == u.id)?.id,
                l.description
            ]);
        });

        setData(_data)
    }, [logs]);

    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Logs</h1>
            <TableList columns={["Id", "TimeStamp", "Author", "Description"]}
                       data={data}
            ></TableList>
        </div>
        <PageFooter/>
    </>;
}

export default AdminLog;