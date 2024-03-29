import React, { useState, useEffect, useRef } from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import { AccountType, Field, FieldType } from "../models.ts";
import toast from "react-hot-toast";
import { createUnit, useUnits, deleteUnit, editUnit } from "../api/units.ts";
import PageFooter from "../components/PageFooter.tsx";
import TableList from "../components/TableList";
import PopupForm from "../components/PopupForm.tsx";

const AdminAddUnit = () => {
    useAuth([AccountType.Admin]);
    const { units, refreshUnits } = useUnits();
    const [data, setData] = useState([]);
    const unitCreationPopup = useRef<PopupForm>();
    const unitEditPopup = useRef<PopupForm>();

    useEffect(() => {
        setData(units.map(unit => [unit.id, unit.name, unit.description]));
    }, [units]);

    const unitCreationFields: Array<Field> = [
        {
            name: "Name",
            key: "name",
            type: FieldType.Text,
            required: true
        },
        {
            name: "Description",
            key: "description",
            type: FieldType.Text,
            required: true
        },
    ];

    const editUnitFields: Array<Field> = [
        {
            name: "Name",
            key: "name",
            type: FieldType.Text,
            required: true
        },
        {
            name: "Description",
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
        }).then(() => {
            refreshUnits();
            unitCreationPopup.current.show(false);
        });
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

    const handleEdit = (unitId) => {
        const unitToEdit = units.find(unit => unit.id === unitId);
        if(unitToEdit) {
            unitEditPopup.current.show(true);
            unitEditPopup.current.setData(unitToEdit);
            console.log(unitToEdit);
        }
    };

    const handleEditSubmit = (data) => {
        toast.promise(editUnit(data), {
            loading: "Editing unit...",
            success: "Unit edited",
            error: "Failed to edit unit"
        }).then(() => {
            refreshUnits();
            unitEditPopup.current.show(false);
        });
    };
    


    return (
        <>
            <NavigationHeader />
            <div className="page-content">
                <h1>Units</h1>
                <button onClick={() => unitCreationPopup.current.show()}
                    style={{
                        width: "100px",
                        borderRadius: "4px"
                    }}>
                Add unit <i className="fa-solid fa-plus"></i>
                </button>
                <PopupForm
                    ref={unitCreationPopup}
                    title={"New Unit"}
                    forms={[unitCreationFields]}
                    onSubmit={handleNewUnit}
                />
                <PopupForm
                    ref={unitEditPopup}
                    title={"Edit Unit"}
                    forms={[editUnitFields]}
                    onSubmit={handleEditSubmit}
                />

                <TableList
                    columns={['ID', 'Name', 'Description']}
                    data={data}
                    buttons={[
                        {
                            text: <i className="fa-solid fa-pen-to-square"></i>,
                            callback: (unitId) => handleEdit(unitId)
                        },
                        {
                            text: <i className="fa-solid fa-trash"></i>,
                            callback: handleDelete,
                        }

                    ]}
                />
            </div>
            <PageFooter />
        </>
    );
};

export default AdminAddUnit;
