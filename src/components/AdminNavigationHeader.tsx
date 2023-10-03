import logo from "../assets/logo.svg"

const AdminNavigationHeader = () => {
    return (<>
        <div className={"navigation-header"}>
            <img src={logo} alt={"Logo"}/>
            <a href={"machines"}>MACHINES</a>
            <a href={"issues"}>ISSUES</a>
            <a href={"customers"}>CUSTOMERS</a>
            <a href={"logout"}>LOG OUT</a>
        </div>
    </>);
};

export default AdminNavigationHeader;