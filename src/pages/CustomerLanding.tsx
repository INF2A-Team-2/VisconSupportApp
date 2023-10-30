import NavigationHeader from "../components/NavigationHeader.tsx";
import {WideButton} from "../components/WideButton.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";

const CustomerLanding = () => {
    const user = useAuth([AccountType.User]);

    return (<>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Welcome {user?.username}</h1>
            <p>Recent Issues:</p>
            <WideButton title={"Test"} target={"test"}/>
        </div>
    </>);
};

export default CustomerLanding;