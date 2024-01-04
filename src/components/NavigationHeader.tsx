import logo from "../assets/logo.svg";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useNavigate} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider.tsx';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "../index.css";



const CustomerNavigationHeader = () => {
    return (<>
        <a href={"/my-issues"}>My Issues</a>
        <a href={"/solved-issues"}>View Solutions</a>
    </>);
};


const EmployeeNavigationHeader = () => {
    return (<>
            <a href={"/my-issues"}>My Issues</a>
            <a href={"/employee/users"}>My Customers</a>
    </>);
};

const AdminNavigationHeader = () => {
    return (<>
        <a href={"/admin/issues"}>Issues</a>
        <a href={"/admin/users"}>Users</a>
        <a href={"/admin/new-units"}>Units</a>
        <a href={"/admin/import"}>Import</a>
        <a href={"/admin/new-machine"}>Add Machine</a>
        
    </>);
};



const NavigationHeader = () => {
    const navigate = useNavigate();
    const user = useAuth();
    const { theme, toggleTheme } = useTheme();
    let headerComponent = <></>;
    

    

    if (user !== null) {
        switch (user.type) {
            case AccountType.User:
                headerComponent = <CustomerNavigationHeader />;
                break;
            case AccountType.HelpDesk:
                headerComponent = <EmployeeNavigationHeader />;
                break;
            case AccountType.Admin:
                headerComponent = <AdminNavigationHeader />;
                break;
        }
    }
    return (
        <div className={"navigation-header"}>
            <img src={logo} alt={"Logo"} onClick={() => navigate("/")}/>
            {headerComponent}
            <div>
                <div className={"navigation-header-user-dropdown"}>
                    <p className={"navigation-header-user-dropdown-button"}>{user && user.username}<FontAwesomeIcon icon={"chevron-down"}/></p>
                    <div className={"navigation-header-user-dropdown-content"}>
                        <a href={""}><i className="fa-solid fa-gears"></i>Settings</a>
                        <a href={"/logout"}><i className="fa-solid fa-right-from-bracket"></i>Logout</a>
                    </div>
                </div>
                <FontAwesomeIcon 
                    icon={theme === 'light' ? "moon" : "sun"}
                    onClick={toggleTheme} 
                    className={"theme-toggle-icon"} 
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </div>
    );
};
export default NavigationHeader;

// een lege line speciaal voor luuk :)))))
