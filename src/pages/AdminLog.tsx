import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useLogs} from "../api/logs.ts";

const AdminLog = () => {

    const currentUser = useAuth([AccountType.Admin]);

    const logs = useLogs();







    return <>

    </>
}

export default AdminLog;