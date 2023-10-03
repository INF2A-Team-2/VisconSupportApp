import logo from "../assets/logo.svg"

const EmployeeNavigationHeader = () => {
    return (<>
        <div className={"navigation-header"}>
            <img src={logo} alt={"Logo"}/>
            <a href={"issues"}>MY ISSUES</a>
            <a href={"new-issue"}>CREATE ISSUE</a>
            <a href={"customers"}>MY CUSTOMERS</a>
            <a href={"logout"}>LOG OUT</a>
        </div>
    </>);
};

export default EmployeeNavigationHeader;