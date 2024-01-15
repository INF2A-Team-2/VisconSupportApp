import useAuth from "../api/auth.ts";
import {AccountType, Log} from "../models.ts";
import {useLogs} from "../api/logs.ts";
import NavigationHeader from "../components/NavigationHeader.tsx";
import TableList from "../components/TableList.tsx";
import PageFooter from "../components/PageFooter.tsx";
import {useEffect, useState} from "react";
import {useUsers} from "../api/users.ts";
import strftime from "strftime";

const AdminLog = () => {

    useAuth([AccountType.Admin]);

    const {logs} = useLogs();

    const [data , setData ] = useState([]);

    const {users} = useUsers();

    const getColor = (x) => {
        if (x[3]?.includes("deleted")) {
            return "#D3212C";
        }

        if (x[3]?.includes("edited")) {
            return "#FF980E";
        }

        if (x[3]?.includes("created")) {
            return "#006B3D";
        }

        return "rgba(0, 0, 0, 0)";
    };

    useEffect(() => {
        const _data = [];
        logs.forEach(l => {
            _data.push([
                l.id,
                strftime("%F %H:%M", new Date(l.timeStamp)),
                users.find(u => l.authorId == u.id)?.username ?? "null",
                l.description
            ]);
        });

        setData(_data);
    }, [logs, users]);

    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Logs</h1>
            <TableList columns={["Id", "TimeStamp", "Author", "Description"]}
                       data={data}
                       colorSelector={getColor}
            ></TableList>
        </div>
        <PageFooter/>
    </>;
}

export default AdminLog;