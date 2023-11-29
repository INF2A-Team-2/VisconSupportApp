import NavigationHeader from "../components/NavigationHeader.tsx";
import {WideButton} from "../components/WideButton.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useIssues} from "../api/issues.ts";

const CustomerLanding = () => {
    const user = useAuth([AccountType.User]);

    const {issues} = useIssues({quantity: 5});

    return (<>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Welcome {user?.username}</h1>
            <p>Recent Issues:</p>
            {issues.sort((a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime())
                .map((i) => <WideButton key={i.id} title={i.headline} target={`issue/${i.id}`}/>)}
        </div>
    </>);
};

export default CustomerLanding;