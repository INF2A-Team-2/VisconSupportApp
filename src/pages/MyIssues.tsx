import {useEffect, useState} from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import { useNavigate } from "react-router-dom";
import 'react-dropdown/style.css';
import '../index.css';
import { useMachines } from "../api/machines.ts";
import { useIssues } from "../api/issues.ts";
import PageFooter from "../components/PageFooter.tsx";
import useAuth from "../api/auth.ts";
import strftime from "strftime";
import TableList from "../components/TableList.tsx";



const MyIssuesPage = () => {
    useAuth();

    const navigate = useNavigate();

    const {issues} = useIssues();
    const {machines} = useMachines();

    const [data, setData] = useState([]);

    useEffect(() => {
        const _data = [];
        issues.forEach(i => {
            const machine = machines.find(m => m.id == i.machineId);

            _data.push([
                i.id,
                i.headline,
                strftime("%F %H:%M", new Date(i.timeStamp)),
                machine !== undefined ? `${machine.name} [${machine.id}]` : "null"
            ]);
        });

        setData(_data);
    }, [issues, machines]);


    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Issues</h1>
            <TableList columns={["ID", "Headline", "Date", "Machine"]}
                       data={data}
                       defaultSort={{key: 2, desc: true}}
                       buttons={[
                           {
                               text: <i className="fa-solid fa-arrow-right"></i>,
                               callback: (issueId) => navigate(`/issue/${issueId}`)
                           }
                       ]}/>
        </div>
        <PageFooter />
    </>;
};

export default MyIssuesPage;
