import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth, {RequestConfig, SERVER_URL} from "../api/auth.ts";
import {AccountType, User} from "../models.ts";
import {useEffect, useState} from "react";
import axios from "axios";

const AdminIssueManager = () => {
    const user = useAuth([AccountType.Admin]);

    const [issues, setIssues] = useState<Array<User>>([])

    useEffect(() => {
        axios.get(SERVER_URL + "/api/issues", RequestConfig())
            .then(response => {
            setIssues(response.data);
        })
    }, [])

    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <div className={"admin-users-edit-header"}>
                <h1>Issues</h1>
            </div>
            <div className={"admin-users-legenda"}>
                <p>Id</p>
                <p>Username</p>
                <p>Type</p>
                <p>Phone number</p>
                <p>Unit</p>
            </div>
            <div className={"admin-users-list"}>
                {issues.map(u => (
                    <div className={"admin-users-list-item"} key={u.id}>
                        <p>{u.id}</p>
                        <p>{u.username}</p>
                        <p>{u.type}</p>
                        <p>{u.phoneNumber}</p>
                        <p>{u.unit}</p>
                    </div>))}
            </div>
        </div>
    </>
}

export default AdminIssueManager;