import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import { AccountType } from "../models.ts";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { createUnit } from "../api/units.ts";
import PageFooter from "../components/PageFooter.tsx";

const AdminAddUnit = () => {
    useAuth([AccountType.Admin]);

    const [unitName, setUnitName] = useState("");
    const [unitDescription, setUnitDescription] = useState("");

    const handleUnitNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUnitName(e.target.value);
    };

    const handleUnitDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUnitDescription(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.promise(createUnit({
            name: unitName,
            description: unitDescription
        }), {
            loading: "Creating unit...",
            success: "Unit created",
            error: "Failed to create unit"
        }).then(() => {
            setUnitName("");
            setUnitDescription("");
        });
    };

    return (
        <>
            <NavigationHeader/>
            <div className={"page-content"}>
                <h1>Add Unit</h1>
                <form onSubmit={handleSubmit}>
                    <div className={"section"}>
                        <label htmlFor="unitName">Unit Name:</label>
                        <input 
                            className={"text-input"} 
                            type="text" 
                            id="unitName" 
                            value={unitName} 
                            onChange={handleUnitNameChange} 
                            placeholder="Enter unit name" 
                        />
                        <label htmlFor="unitDescription">Unit Description:</label>
                        <input 
                            className={"text-input"} 
                            type="text" 
                            id="unitDescription" 
                            value={unitDescription} 
                            onChange={handleUnitDescriptionChange} 
                            placeholder="Enter unit description" 
                        />
                        <button type="submit" className={"submit-button"}>Create Unit</button>
                    </div>
                </form>
            </div>
            <PageFooter/>
        </>
    );
};

export default AdminAddUnit;
