import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserMachines } from "../api/machines.ts";
import { useUser } from "../api/users.ts";
import { useIssues } from "../api/issues.ts";
import NavigationHeader from "../components/NavigationHeader.tsx";
import { RenderIssueDetails } from "../components/RenderIssueDetails.tsx";
import TableList from "../components/TableList.tsx";
import {useNavigate} from "react-router-dom";


const EmployeeUserInformation = () => {
    const { userId } = useParams();
    const { machines } = useUserMachines({ userId: parseInt(userId, 10) });
    const { issues } = useIssues({ userId: parseInt(userId, 10) });
    const { user } = useUser({ userId: parseInt(userId, 10) });
    const navigate = useNavigate();
    const machineColumns = ["ID", "Name"];
    const issueColumns = ["ID", "Headline", "Machine", "Status"];

    const machineData = machines.map(machine => [machine.id, machine.name]);
    const issueData = issues.map(issue => [issue.id, issue.headline, issue.machineId, "(Not implemented)"]);

    

    return (
        <>
            <NavigationHeader />
            <div className={"page-content"}>
                <h1> {user?.username}'s information</h1>
                <h2>User's machines</h2>
                <TableList columns={machineColumns} data={machineData}
                 />

                <h2>User's Issues</h2>
                <TableList columns={issueColumns} data={issueData}
                buttons={[
                    {
                        text: <i className="fa-solid fa-arrow-right"></i>,
                        callback: (issueId) => navigate(`/issue/${issueId}`)
                    }
                ]}
                />
            </div>
        </>
    );
};

export default EmployeeUserInformation;
