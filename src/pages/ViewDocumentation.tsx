import { useParams } from "react-router-dom";
import { useDocumentation as useReport } from "../api/documentation";
import NavigationHeader from "../components/NavigationHeader";
import { marked } from "marked";

const ViewDocumentation = () => {
    const docId = parseInt(useParams().documentationId);

    const {report} = useReport({id: docId});

    if (!report) return (<>
        <NavigationHeader />
        <div className={"page-content"}>
            <h1>Loading...</h1>
        </div>
    </>);

    return (<>
        <NavigationHeader />
        <div className={"page-content"}>
            <h1>{report?.title}</h1>
            <div dangerouslySetInnerHTML={{__html: marked(report?.body)}}></div>
        </div>
    </>);
};

export default ViewDocumentation;