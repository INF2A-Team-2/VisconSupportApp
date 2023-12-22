import NavigationHeader from "../components/NavigationHeader.tsx";
import {WideButton} from "../components/WideButton.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useIssues} from "../api/issues.ts";
import PageFooter from "../components/PageFooter.tsx";
import StatCard from "../components/StatCard.tsx";

const CustomerLanding = () => {
    const user = useAuth([AccountType.User]);

    const {issues} = useIssues({quantity: 5});

    return <>
        <NavigationHeader/>
        <div className={"page-content admin-landing-grid"}>
            <h1>Welcome {user?.username}</h1>
            <div className={"landing-grid"}>
                <StatCard title={"Recent issues"}
                          body={<>
                          </>}
                          target={""} />

                <StatCard title={"Notifications"}
                          body={<>
                          </>}
                          target={""} />
            </div>
            {/*<p>Recent Issues:</p>*/}
            {/*{issues.sort((a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime())*/}
            {/*    .map((i) => <WideButton key={i.id} title={i.headline} target={`issue/${i.id}`}/>)}*/}
        </div>
        <PageFooter />
    </>;
};

export default CustomerLanding;