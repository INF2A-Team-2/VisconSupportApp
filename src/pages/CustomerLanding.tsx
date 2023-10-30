import { useEffect, useState } from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import WideButton from "../components/WideButton.tsx";
import axios from "axios";
import { RequestConfig, SERVER_URL } from "../api/auth.ts";
import { Issue } from "../models.ts";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";

const CustomerLanding = () => {
    const user = useAuth([AccountType.User]);

    const [issues, setIssues] = useState<Array<Issue>>([]);
    let URL = SERVER_URL + "/api/issues";
    useEffect(() => {
        (() => {
            axios.get(URL , RequestConfig())
                .then(response => setIssues(response.data));
        })();
    }, [URL]);

    return (<>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Welcome {user?.username}</h1>
            <p>Recent Issues:</p>
            {issues.map((i) => <WideButton key={i.id} title={i.headline} target={`issue/${i.id}`}/>)}
        </div>
    </>);
};

export default CustomerLanding;
