import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import { AccountType } from "../models.ts";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createUnit, useUnits, deleteUnit } from "../api/units.ts";
import PageFooter from "../components/PageFooter.tsx";
import TableList from "../components/TableList";
import PopupForm from "../components/PopupForm.tsx";
import { Field, FieldType } from "../models.ts";

const AdminAddUnit = () => {
    useAuth([AccountType.Admin]);
    const { units, refreshUnits } = useUnits();
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(units.map(unit => [unit.id, unit.name, unit.description]));
    }, [units]);

    const unitCreationFields: Array<Field> = [
        {
            name: "Unit Name",
            key: "name",
            type: FieldType.Text,
            required: true
        },
        {
            name: "Unit Description",
            key: "description",
            type: FieldType.Text,
            required: true
        },
    ];

    const handleNewUnit = (data) => {
        toast.promise(createUnit(data), {
            loading: "Creating unit...",
            success: "Unit created",
            error: "Failed to create unit"
        }).then(() => refreshUnits());
    };

    const handleDelete = (unitId) => {
        if (!window.confirm("Are you sure that you want to delete this unit?")) {
            return;
        }

        toast.promise(deleteUnit({ unitId }), {
            loading: "Deleting unit...",
            success: "Unit deleted",
            error: "Failed to delete unit"
        }).then(() => refreshUnits());
    };

    return (
        <>
            <NavigationHeader />
            <div className="page-content">
                <h1>Add Unit</h1>
                <PopupForm
                    title={"New Unit"}
                    fields={unitCreationFields}
                    onSubmit={handleNewUnit}
                />
                <TableList
                    columns={['ID', 'Name', 'Description']}
                    data={data}
                    buttons={[
                        {
                            text: "Delete",
                            callback: handleDelete
                        }
                    ]}
                />
            </div>
            <PageFooter />
        </>
    );
};

export default AdminAddUnit;
