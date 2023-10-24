import { useParams } from "react-router-dom";
import NavigationHeader from "../components/NavigationHeader";
import { Issue } from "../models";

const IssuePage = () => {
    const { issueId } = useParams();
    const issue = getIssue(issueId);


    return (<>
        <NavigationHeader />
        <div className={"page-content"}> 
            <h1>{issue.headline}</h1>
        </div>
    </>);

}

const getIssue = (issueId: string): Issue => {
   return {
        id: Number(issueId),
        headline: "Extension not working",
        department: "Poultry",
        description: "This shit is not really working rn"
   };
}

export default IssuePage;
