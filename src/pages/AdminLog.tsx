import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useLogs} from "../api/logs.ts";
import NavigationHeader from "../components/NavigationHeader.tsx";
import TableList from "../components/TableList.tsx";
import {useEffect} from "react";
import PageFooter from "../components/PageFooter.tsx";

const AdminLog = () => {

    const currentUser = useAuth([AccountType.Admin]);

    const logs = useLogs();

    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Logs</h1>
            <TableList columns={["Id", "TimeStamp", "AuthorId", "Description", "IssueId", "UserId", "MachineId", "MessageId", "AttachmentId"]}
                       data={logs}
            ></TableList>
        </div>
        <PageFooter/>
    </>;
}

export default AdminLog;