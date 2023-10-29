import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth, {RequestConfig, SERVER_URL} from "../api/auth.ts";
import {AccountType, Issue, User, Machine} from "../models.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import TableList from "../components/TableList.tsx";

const AdminIssueManager = () => {
    const user = useAuth([AccountType.Admin]);

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
            const machine = machines.find(m => m.id == i.userId)

            _data.push([
                i.id,
                i.headline,
                new Date(i.timeStamp).toLocaleString(),
                user !== undefined ? `${user.username} [${user.id}]` : "",
                machine !== undefined ? `${machine.name} [${machine.id}]` : ""
            ])
        });

        setData(_data);
    }, [issues, users, machines]);


    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <TableList columns={["ID", "Headline", "Date", "User", "Machine"]} data={data} />
        </div>
    </>
}

export default AdminIssueManager;