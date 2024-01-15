import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavigationHeader from "../components/NavigationHeader.tsx";
import PageFooter from "../components/PageFooter.tsx";
import useAuth from "../api/auth.ts";
import { useUserMachines } from "../api/machines.ts";
import { useUser } from "../api/users.ts";
import { useIssues } from "../api/issues.ts";
import TableList from "../components/TableList.tsx";
import { AccountType } from "../models.ts";
import 'react-dropdown/style.css';
import '../index.css';
import strftime from "strftime";

const EmployeeUserInformation = () => {
    useAuth([AccountType.HelpDesk, AccountType.Admin]);

    const { userId } = useParams();
    const navigate = useNavigate();

    const { user } = useUser({ userId: parseInt(userId, 10) });
    const { machines } = useUserMachines({ userId: parseInt(userId, 10) });
    const { issues } = useIssues({ userId: parseInt(userId, 10) });

    const [issueData, setIssueData] = useState([]);

    useEffect(() => {
        const combinedData = issues.map(issue => {
            const machineName = machines.find(machine => machine.id === issue.machineId)?.name || 'Loading';
            return [issue.id, issue.headline, machineName, strftime("%F %H:%M", new Date(issue.timeStamp))];
        });

        setIssueData(combinedData);
    }, [machines, issues]);

    if (!user) {
        return <div>Access Denied</div>;
    }

    return (
        <>
            <NavigationHeader />
            <div className={"page-content"}>
                <h1>{user.username}'s Information</h1>
                <h2>User's Issues</h2>
                <TableList 
                    columns={["ID", "Headline", "Machine Name", "Date"]} 
                    data={issueData} 
                    buttons={[
                        {
                            text: <i className="fa-solid fa-arrow-right"></i>,
                            callback: (issueId) => navigate(`/issue/${issueId}`)
                        }
                    ]}
                />
            </div>
            <PageFooter />
        </>
    );
};

export default EmployeeUserInformation;
