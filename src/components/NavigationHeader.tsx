import logo from "../assets/logo.svg"

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
    let ut = "customer";

    switch (ut) {
        case "customer":
            return (<CustomerNavigationHeader/>);
        case "employee":
            return (<EmployeeNavigationHeader/>);
        case "admin":
            return (<AdminNavigationHeader />);
    }
};

export default NavigationHeader;