import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType, Field, FieldType} from "../models.ts";
import {useEffect, useRef, useState} from "react";
import {toast} from "react-hot-toast";
import TableList from "../components/TableList.tsx";
import PageFooter from "../components/PageFooter.tsx";
import PopupForm from "../components/PopupForm.tsx";
import {deleteCompany, newCompany, useCompanies} from "../api/companies.ts";

const AdminCompanyManager = () => {
    useAuth([AccountType.Admin]);

    const {companies, refreshCompanies} = useCompanies();

    const [data, setData] = useState([]);

    const companyCreationPopup = useRef<PopupForm>();

    useEffect(() => {
        const _data = [];
        companies.forEach(c => {
            _data.push([
                c.id,
                c.name,
                `${c.latitude}, ${c.longitude}`
            ]);
        });

        setData(_data);
    }, [companies]);

    const handleDelete = (companyId) => {
        if (!window.confirm("Are you sure that you want to delete this user?")) {
            return;
        }

        const request = deleteCompany({
            companyId: companyId
        });

        toast.promise(request, {
            loading: "Loading...",
            success: "Deleted company",
            error: "Failed to delete company"
        }).then(() => {
            refreshCompanies();
        });
    };

    const handleEdit = (companyId) => {

    };

    const handleNewCompany = (data : {
        name: string,
        latitude: number
        longitude: number
    }) => {
        const promise = newCompany({
            name: data.name,
            latitude: data.latitude,
            longitude: data.longitude,
        });

        toast.promise(promise, {
            loading: "Creating company...",
            success: "Created company",
            error: "Failed to create company"
        }).then(() => {
            companyCreationPopup.current.show(false);
            refreshCompanies();
        });
    };

    const companyCreationFields: Array<Field> =  [
        {
            name: "Name",
            key: "name",
            type: FieldType.Text,
            required: true
        },
        {
            name: "Latitude",
            key: "latitude",
            type: FieldType.Float,
            required: true,
        },
        {
            name: "Longitude",
            key: "longitude",
            type: FieldType.Float,
            required: true,
        },
    ];

    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Companies</h1>
            <button onClick={() => companyCreationPopup.current.show()}
                    style={{
                        width: "100px",
                        borderRadius: "4px"
                    }}>
                Add company <i className="fa-solid fa-plus"></i>
            </button>
            <TableList columns={["ID", "Name", "Location"]}
                       data={data}
                       buttons={[
                           {
                               text: <i className="fa-solid fa-pen-to-square"></i>,
                               callback: handleEdit
                           },
                           {
                               text: <i className="fa-solid fa-trash"></i>,
                               callback: handleDelete
                           }
                       ]}/>
        </div>
        <PopupForm ref={companyCreationPopup}
                   title={"New user"}
                   forms={[companyCreationFields]}
                   onSubmit={handleNewCompany} />
        <PageFooter />
    </>;
};

export default AdminCompanyManager;