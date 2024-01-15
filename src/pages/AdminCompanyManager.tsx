import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType, Field, FieldType} from "../models.ts";
import {useEffect, useRef, useState} from "react";
import {toast} from "react-hot-toast";
import TableList from "../components/TableList.tsx";
import PageFooter from "../components/PageFooter.tsx";
import PopupForm from "../components/PopupForm.tsx";
import {deleteCompany, newCompany, useCompanies, editCompany} from "../api/companies.ts";

const AdminCompanyManager = () => {
    useAuth([AccountType.Admin]);

    const {companies, refreshCompanies} = useCompanies();

    const [data, setData] = useState([]);

    const companyCreationPopup = useRef<PopupForm>();

    const companyEditPopup = useRef<PopupForm>();

    useEffect(() => {
        const _data = [];
        companies.forEach(c => {
            _data.push([
                c.id,
                c.name,
                c.phoneNumber,
                `${c.latitude}, ${c.longitude}`
            ]);
        });

        setData(_data);
    }, [companies]);

    const handleDelete = (companyId) => {
        if (!window.confirm("Are you sure that you want to delete this company?")) {
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


    const handleNewCompany = (data : {
        name: string,
        latitude: number,
        longitude: number,
        phoneNumber: string
    }) => {
        const promise = newCompany({
            name: data.name,
            latitude: data.latitude,
            longitude: data.longitude,
            phonenumber: data.phoneNumber
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
            required: false,
        },
        {
            name: "Longitude",
            key: "longitude",
            type: FieldType.Float,
            required: false,
        },
        {
            name: "Phonenumber",
            key: "phoneNumber",
            type: FieldType.Text,
            required: false,
        },
    ];

    const companyEditFields: Array<Field> =  [
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
            required: false,
        },
        {
            name: "Longitude",
            key: "longitude",
            type: FieldType.Float,
            required: false,
        },
        {
            name: "Phonenumber",
            key: "phoneNumber",
            type: FieldType.Text,
            required: false,
        },
    ];

    const handleEdit = (companyId) => {
        const companyToEdit = companies.find(company => company.id === companyId);
        if(companyToEdit) {
            const editData = { ...companyToEdit, companyId };
            companyEditPopup.current.show(true);
            companyEditPopup.current.setData(editData);
        }
    };

    const handleEditSubmit = (formData) => {
        const { companyId, ...data } = formData;
        toast.promise(editCompany({ companyId, data }), {
            loading: "Editing company...",
            success: "Company edited",
            error: "Failed to edit company"
        }).then(() => {
            refreshCompanies();
            companyEditPopup.current.show(false);
        });
    };

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
            <TableList columns={["ID", "Name", "Phonenumber", "Location"]}
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
                   title={"New company"}
                   forms={[companyCreationFields]}
                   onSubmit={handleNewCompany} />
        <PopupForm ref={companyEditPopup}
                    title={"Edit Company"} 
                    forms={[companyEditFields]} 
                    onSubmit={handleEditSubmit} />

        <PageFooter />
    </>;
};

export default AdminCompanyManager;