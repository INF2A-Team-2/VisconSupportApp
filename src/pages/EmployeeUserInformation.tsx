import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserMachines } from "../api/machines.ts";
import { useUser } from "../api/users.ts";
import { useIssues } from "../api/issues.ts";
import NavigationHeader from "../components/NavigationHeader.tsx";
import { RenderIssueDetails } from "../components/RenderIssueDetails.tsx";
import TableList from "../components/TableList.tsx";


const EmployeeUserInformation = () => {
    const { userId } = useParams();
    const { machines } = useUserMachines({ userId: parseInt(userId, 10) });
    const { issues } = useIssues({ userId: parseInt(userId, 10) });
    const { user } = useUser({ userId: parseInt(userId, 10) });

    const machineColumns = ["ID", "Name"];
    const issueColumns = ["ID", "Headline", "Machine", "Status"];

    const machineData = machines.map(machine => [machine.id, machine.name]);
    const issueData = issues.map(issue => [issue.id, issue.headline, issue.machineId, "(Not implemented))"]);
    

    return (
        <>
            <NavigationHeader />
            <div className={"page-content"}>
                <h1>User's Issues</h1>
                <TableList columns={issueColumns} data={issueData} />
                <h2>User's Machines</h2>
                <TableList columns={machineColumns} data={machineData} />
            </div>
        </>
    );
};

export default EmployeeUserInformation;
