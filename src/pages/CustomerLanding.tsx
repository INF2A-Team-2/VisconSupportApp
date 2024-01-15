import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useIssues} from "../api/issues.ts";
import PageFooter from "../components/PageFooter.tsx";
import StatCard from "../components/StatCard.tsx";

const CustomerLanding = () => {
    const user = useAuth([AccountType.User]);

    return <>
        <NavigationHeader/>
        <div className={"page-content admin-landing-grid"}>
            <h1>Welcome {user?.username}</h1>
            <div className={"landing-grid"}>
                <StatCard title={"Recent issues"}
                          body={<>
                          </>}
                          target={"/my-issues"} />

                <StatCard title={"Notifications"}
                          body={<>
                          </>}
                          target={""} />
            </div>
        </div>
        <PageFooter />
    </>;
};

export default CustomerLanding;