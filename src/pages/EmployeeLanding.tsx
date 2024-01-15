import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import PageFooter from "../components/PageFooter.tsx";
import StatCard from "../components/StatCard.tsx";

const EmployeeLanding = () => {
    const user = useAuth([AccountType.HelpDesk]);
    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Welcome {user?.username}</h1>
            <div className={"landing-grid"}>
                <StatCard title={"Recent issues"}
                        body={<></>}
                        target={"/my-issues"} />

                <StatCard title={"Customers"}
                        body={<> </>}
                        target={"/employee/users"} />
            </div>
        </div>
        <PageFooter />
    </>;
};

export default EmployeeLanding;