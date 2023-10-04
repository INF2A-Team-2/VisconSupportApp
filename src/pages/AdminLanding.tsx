import AdminNavigationHeader from "../components/NavigationHeader.tsx";

const AdminLanding = () => {
    return (<>
        <AdminNavigationHeader/>
        <div className={"page-content"}>
            <h1 className={"welcome_admin"}>Welcome Admin</h1>
        </div>
    </>);
};

export default AdminLanding;
