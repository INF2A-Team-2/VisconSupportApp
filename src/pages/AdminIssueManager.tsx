import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth, {RequestConfig, SERVER_URL} from "../api/auth.ts";
import {AccountType, Issue, User, Machine} from "../models.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import TableList from "../components/TableList.tsx";

const AdminIssueManager = () => {
    useAuth([AccountType.Admin]);

    const [issues, setIssues] = useState<Array<Issue>>([]);
    const [users, setUsers] = useState<Array<User>>([]);
    const [machines, setMachines] = useState<Array<Machine>>([]);

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(SERVER_URL + "/api/issues", RequestConfig())
            .then(response => {
            setIssues(response.data);
        })

        axios.get(SERVER_URL + "/api/users", RequestConfig())
            .then(response => {
                setUsers(response.data);
            })

        axios.get(SERVER_URL + "/api/machines", RequestConfig())
            .then(response => {
                setMachines(response.data);
            })
    }, [])

    useEffect(() => {
        const _data = []
        issues.forEach(i => {
            const user = users.find(u => u.id == i.userId);
            const machine = machines.find(m => m.id == i.machineId)

            _data.push([
                i.id,
                i.headline,
                new Date(i.timeStamp).toLocaleString(),
                user !== undefined ? `${user.username} [${user.id}]` : "null",
                machine !== undefined ? `${machine.name} [${machine.id}]` : "null"
            ])
        });

        setData(_data);
    }, [issues, users, machines]);


    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Issues</h1>
            <TableList columns={["ID", "Headline", "Date", "User", "Machine"]} data={data} defaultSort={{key: 2, desc: true}}/>
        </div>
    </>
}

export default AdminIssueManager;