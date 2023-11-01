import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth, {RequestConfig, SERVER_URL} from "../api/auth.ts";
import {AccountType, Issue} from "../models.ts";
import StatCard from "../components/StatCard.tsx";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {useEffect, useState} from "react";
import axios from "axios";

const AdminLanding = () => {
    const user = useAuth([AccountType.Admin]);

    const [issues, setIssues] = useState<Array<Issue>>([]);

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(SERVER_URL + "/api/issues", RequestConfig())
            .then(response => {
                setIssues(response.data);
            });
    }, []);

    useEffect(() => {
        const startDate = issues.map(i => new Date(i.timeStamp))
            .sort((a, b) => {
                return a.getTime() - b.getTime();
            })[0];

        const _data = [];

        for (let d = startDate; d <= new Date(); d.setDate(d.getDate() + 1)) {
            const dIssues = issues.filter(i => new Date(i.timeStamp).getTime() - 86400000 <= d.getTime());

            _data.push({
                name: d.toLocaleDateString(),
                issues: dIssues.length
            });
        }

        setData(_data);
    }, [issues]);

    const openIssueCount = issues.length;
    const issuesTodayCount = issues.filter(i => new Date(i.timeStamp).toDateString() === new Date().toDateString()).length;

    return (<>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Welcome {user?.username}</h1>
            <div className={"admin-landing-grid"}>
                <StatCard title={"Issues"}
                        description={`${openIssueCount} open issues\n${issuesTodayCount} new ${issuesTodayCount == 1 ? "issue" : "issues"} today`}
                        target={"/admin/issues"}
                        style={{
                            width: 716
                        }} />

                <LineChart width={700}
                           height={300}
                           data={data}
                           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                           style={{
                               background: "var(--platinum)",
                               borderRadius: "4px",
                               padding: "16px"
                           }}>
                    <CartesianGrid strokeDasharray="3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="issues" stroke="#27559e" />
                </LineChart>
            </div>
        </div>
    </>);
};

export default AdminLanding;