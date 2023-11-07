import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useEffect, useState} from "react";
import TableList from "../components/TableList.tsx";
import strftime from "strftime";
import {useIssues} from "../api/issues.ts";
import {useUsers} from "../api/users.ts";
import {useMachines} from "../api/machines.ts";
import {useNavigate} from "react-router-dom";

const AdminIssueManager = () => {
    useAuth([AccountType.Admin]);

    const navigate = useNavigate();

    const {issues} = useIssues();
    const {users} = useUsers();
    const {machines} = useMachines();

    const [data, setData] = useState([]);

    useEffect(() => {
        const _data = [];
        issues.forEach(i => {
            const user = users.find(u => u.id == i.userId);
            const machine = machines.find(m => m.id == i.machineId);

            _data.push([
                i.id,
                i.headline,
                strftime("%F %H:%M", new Date(i.timeStamp)),
                user !== undefined ? `${user.username} [${user.id}]` : "null",
                machine !== undefined ? `${machine.name} [${machine.id}]` : "null"
            ]);
        });

        setData(_data);
    }, [issues, users, machines]);


    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Issues</h1>
            <TableList columns={["ID", "Headline", "Date", "User", "Machine"]}
                       data={data}
                       defaultSort={{key: 2, desc: true}}
                       buttons={[
                           {
                               text: <i className="fa-solid fa-arrow-right"></i>,
                               callback: (issueId) => navigate(`/issue/${issueId}`)
                           }
                       ]}/>
        </div>
    </>;
};

export default AdminIssueManager;