import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import StatCard from "../components/StatCard.tsx";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {useEffect, useState} from "react";
import {useIssues} from "../api/issues.ts";
import PageFooter from "../components/PageFooter.tsx";

const AdminLanding = () => {
    const user = useAuth([AccountType.Admin]);

    const {issues} = useIssues();

    const [data, setData] = useState([]);

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
            <div className={"landing-grid"}>
                <StatCard title={"Issues"}
                          body={<pre>{openIssueCount} open issues <br />{issuesTodayCount} new {issuesTodayCount == 1 ? "issue" : "issues"} today</pre>}
                        target={"/admin/issues"} />

                <LineChart width={700}
                           height={300}
                           data={data}
                           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                           style={{
                               background: "var(--background-2)",
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
        <PageFooter />
    </>);
};

export default AdminLanding;