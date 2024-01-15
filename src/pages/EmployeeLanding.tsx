import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import PageFooter from "../components/PageFooter.tsx";
import StatCard from "../components/StatCard.tsx";
import {useNavigate} from "react-router-dom";
import {useUsers} from "../api/users.ts";
import React from "react";
import {useIssues} from "../api/issues.ts";
import moment from "moment/moment";

const EmployeeLanding = () => {
    const user = useAuth([AccountType.HelpDesk]);

    const navigate = useNavigate();

    const {issues} = useIssues();
    const {users: customers} = useUsers();

    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Welcome {user?.username}</h1>
            <div className={"landing-grid"}>
                <StatCard title={"Recent issues"}
                        body={<>
                            {issues.sort((a, b) => new Date(b.timeStamp).valueOf() - new Date(a.timeStamp).valueOf())
                                .slice(0, 5)
                                .map(i => <>
                                    <div key={i.id} className={"recent-issue-item"} onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/issue/${i.id}`);
                                    }}>
                                        <p>{i.headline}</p>
                                        <p className={"timeago"}>{moment(i.timeStamp).fromNow()}</p>
                                    </div>
                                </>)}
                        </>}
                        target={"/my-issues"} />

                <StatCard title={"Customers"}
                        body={<>
                            {customers.map(c => <>
                                <div key={c.id} className={"recent-issue-item"}>
                                    <p>{c.username}</p>
                                </div>
                            </>)}
                        </>}
                        target={"/employee/users"} />
            </div>
        </div>
        <PageFooter />
    </>;
};

export default EmployeeLanding;