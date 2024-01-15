import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType, Priority, Status} from "../models.ts";
import {useEffect, useState} from "react";
import TableList from "../components/TableList.tsx";
import strftime from "strftime";
import {useIssues} from "../api/issues.ts";
import {useUsers} from "../api/users.ts";
import {useMachines} from "../api/machines.ts";
import {useNavigate} from "react-router-dom";
import PageFooter from "../components/PageFooter.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const AdminIssueManager = () => {
    const currUser = useAuth([AccountType.Admin]);

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
                Priority[i.priority],
                Status[i.status],
                strftime("%F %H:%M", new Date(i.timeStamp)),
                user !== undefined ? `${user.username} [${user.id}]` : currUser.username ?? "null",
                machine !== undefined ? `${machine.name} [${machine.id}]` : "null"
            ]);
        });

        setData(_data);
    }, [issues, users, machines]);


    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Issues</h1>
            <TableList columns={["ID", "Headline", "Priority", "Status", "Date", "User", "Machine"]}
                       data={data}
                       defaultSort={{key: 4, desc: true}}
                       buttons={[
                           {
                               text: <FontAwesomeIcon icon={"arrow-right"}/>,
                               callback: (issueId: number) => navigate(`/issue/${issueId}`)
                           }
                       ]}/>
        </div>
        <PageFooter />
    </>;
};

export default AdminIssueManager;