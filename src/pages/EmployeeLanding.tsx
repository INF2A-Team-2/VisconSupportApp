import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";

const EmployeeLanding = () => {
    const user = useAuth([AccountType.HelpDesk]);

    return (<>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Welcome {user?.username}</h1>
        </div>
    </>);
};

export default EmployeeLanding;