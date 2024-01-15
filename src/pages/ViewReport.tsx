import { useParams } from "react-router-dom";
import { useReport } from "../api/reports";
import NavigationHeader from "../components/NavigationHeader";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { useMachine } from "../api/machines";

const ViewReport = () => {
    const reportId = parseInt(useParams().reportId);
    const {report} = useReport({id: reportId});
    const {machine} = useMachine({machineId: report?.machineId});

    if (!report) return (<>
        <NavigationHeader />
        <div className={"page-content"}>
            <h1>Loading...</h1>
        </div>
    </>);

    return (<>
        <NavigationHeader />
        <div className={"page-content"}>
            <div className={"issue-header"}>
                <h1>Report: {report?.title}</h1>
                <h2><i className="fa-solid fa-gears"></i>{machine?.name}</h2>
            </div>
            <div className={"issue-content"}>
                <h2>Body</h2>
                <div dangerouslySetInnerHTML={{__html: sanitizeHtml(marked(report?.body))}}></div>
            </div>
        </div>
    </>);
};

export default ViewReport;