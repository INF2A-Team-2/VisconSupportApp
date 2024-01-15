import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useReports} from "../api/reports.ts";
import {useEffect, useState} from "react";
import strftime from "strftime";
import {useCompanies} from "../api/companies.ts";
import NavigationHeader from "../components/NavigationHeader.tsx";
import TableList from "../components/TableList.tsx";
import PageFooter from "../components/PageFooter.tsx";

const AdminReportManager = () => {
    useAuth([AccountType.Admin])

    const {reports} = useReports();
    const {companies} = useCompanies();
    const [data, setData] = useState([]);

    useEffect(() => {
        const _data = [];
        reports.forEach(r => {
            _data.push([
                r.id,
                r.title,
                companies.find(c => c.id == r.companyId)?.name ?? "null",
                r.public ? "Public" : "Not Public",
                strftime("%F", new Date(r.timeStamp)),
            ]);
        });

        setData(_data);
    }, [reports, companies]);

    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Reports</h1>
            <TableList columns={["Id", "Title", "Company", "Visibility", "Date"]}
                       data={data}
            ></TableList>
        </div>
        <PageFooter/>
    </>;
}

export default AdminReportManager;