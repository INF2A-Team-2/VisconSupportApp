import logo from "../assets/logo.svg"
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";

const CustomerNavigationHeader = () => {
    return (<>
        <a href={"issues"}>My Issues</a>
        <a href={"solved-issues"}>Create Issue</a>
    </>);
};

const EmployeeNavigationHeader = () => {
    return (<>
            <a href={"issues"}>My Issues</a>
            <a href={"new-issue"}>Create Issue</a>
            <a href={"customers"}>My Customers</a>
    </>);
};

const AdminNavigationHeader = () => {
    return (<>
        <a href={"issues"}>Issues</a>
    </>);
};

const NavigationHeader = () => {
    const user = useAuth();

    let headerComponent = <></>;

    if (user !== null) {
        switch (user.type) {
            case AccountType.User:
                headerComponent = <CustomerNavigationHeader />;
                break;
            case AccountType.HelpDesk:
                headerComponent = <EmployeeNavigationHeader />;
                break;
            case AccountType.Admin:
                headerComponent = <AdminNavigationHeader />;
                break;
        }
    }

    return <>
        <div className={"navigation-header"}>
            <img src={logo} alt={"Logo"}/>
             {headerComponent}
            <a href={"logout"}>Log Out</a>
        </div>
    </>;
};

export default NavigationHeader;

// een lege line speciaal voor luuk :)))))
