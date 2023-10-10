import NavigationHeader from "../components/NavigationHeader.tsx";

const AdminLanding = () => {
    return (<>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1 className={"welcome_admin"}>Welcome Admin</h1>
        </div>
    </>);
};

export default AdminLanding;