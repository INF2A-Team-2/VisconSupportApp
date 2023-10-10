import logo from "../assets/logo.svg"
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";

const CustomerNavigationHeader = () => {
    return (<>
        <div className={"navigation-header"}>
            <img src={logo} alt={"Logo"}/>
            <a href={"issues"}>My Issues</a>
            <a href={"new-issue"}>Create Issue</a>
            <a href={"logout"}>Log Out</a>
        </div>
    </>);
};

const EmployeeNavigationHeader = () => {
    return (<>
        <div className={"navigation-header"}>
            <img src={logo} alt={"Logo"}/>
            <a href={"issues"}>My Issues</a>
            <a href={"new-issue"}>Create Issue</a>
            <a href={"customers"}>My Customers</a>
            <a href={"logout"}>Log Out</a>
        </div>
    </>);
};

const AdminNavigationHeader = () => {
    return (<>
        <div className={"navigation-header"}>
            <img src={logo} alt={"Logo"}/>
            <a href={"issues"}>Issues</a>
            <a href={"logout"}>Log Out</a>
        </div>
    </>);
};

const NavigationHeader = () => {
    const user = useAuth();

    if (user !== null) {
        switch (user.type) {
            case AccountType.User:
                return (<CustomerNavigationHeader/>);
            case AccountType.HelpDesk:
                return (<EmployeeNavigationHeader/>);
            case AccountType.Admin:
                return (<AdminNavigationHeader />);
        }
    } else {
        return <></>;
    }
};

export default NavigationHeader;