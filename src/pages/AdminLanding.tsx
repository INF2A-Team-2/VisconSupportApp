import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth, {RequestConfig, SERVER_URL} from "../api/auth.ts";
import {AccountType, Issue} from "../models.ts";
import StatCard from "../components/StatCard.tsx";
import {LineChart} from "recharts";
import {useEffect, useState} from "react";
import axios from "axios";

const AdminLanding = () => {
    const user = useAuth([AccountType.Admin]);

    const [issues, setIssues] = useState<Array<Issue>>([]);

    useEffect(() => {
        axios.get(SERVER_URL + "api/issues", RequestConfig())
            .then(response => {
                setIssues(response.data);
            })
    }, []);

    const openIssueCount = issues.length;
    const issuesTodayCount = issues.filter(i => new Date(i.timeStamp).toDateString() === new Date().toDateString());

    return (<>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Welcome {user?.username}</h1>
            <div className={"admin-landing-grid"}>
                <StatCard title={"Issues"} description={`${openIssueCount} open issues\n${issuesTodayCount} new issues today`} target={"/admin/issues"} />
                <StatCard title={"Issues"} description={"11 open issues\n3 new issues today"} target={"/admin/issues"} />
                <StatCard title={"Issues"} description={"11 open issues\n3 new issues today"} target={"/admin/issues"} />
                <LineChart>

                </LineChart>
            </div>
        </div>
    </>);
};

export default AdminLanding;