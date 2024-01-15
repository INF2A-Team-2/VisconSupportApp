import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useIssues} from "../api/issues.ts";
import PageFooter from "../components/PageFooter.tsx";
import StatCard from "../components/StatCard.tsx";
import {useNavigate} from "react-router-dom";
import React from "react";
import moment from "moment";

const CustomerLanding = () => {
    const user = useAuth([AccountType.User]);

    const navigate = useNavigate();

    const {issues} = useIssues();

    return <>
        <NavigationHeader/>
        <div className={"page-content admin-landing-grid"}>
            <h1>Welcome {user?.username}</h1>
            <div className={"landing-grid"}>
                <StatCard title={"Recent issues"}
                          body={<>
                              {issues.sort((a, b) => new Date(b.timeStamp).valueOf() - new Date(a.timeStamp).valueOf())
                                  .slice(0, 5)
                                  .map(i => <>
                                      <div key={i.id} className={"recent-issue-item"} onClick={(e) => {
                                          e.stopPropagation();
                                          navigate(`/issue/${i.id}`);
                                      }}>
                                          <p>{i.headline}</p>
                                          <p className={"timeago"}>{moment(i.timeStamp).fromNow()}</p>
                                      </div>
                                  </>)}
                          </>}
                          target={"/my-issues"} />
            </div>
        </div>
        <PageFooter />
    </>;
};

export default CustomerLanding;