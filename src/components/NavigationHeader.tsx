import logo from "../assets/logo.svg";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import {useNavigate} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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

    let headerComponent = <></>;

    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.body.className = savedTheme; 
    }, []);

    const toggleTheme = () =>
    {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    }


    const applyTheme = (theme) => {
        const root = document.documentElement;
    
        if (theme === 'light') {
            root.style.setProperty('--accent', 'var(--light-accent)');
            root.style.setProperty('--accent-2', 'var(--light-accent-2)');
            root.style.setProperty('--accent-3', 'var(--light-accent-3)');
            root.style.setProperty('--background', 'var(--light-background)');
            root.style.setProperty('--background-2', 'var(--light-background-2)');
            root.style.setProperty('--background-3', 'var(--light-background-3)');
            root.style.setProperty('--text', 'var(--light-text)');
            root.style.setProperty('--text-hover', 'var(--light-text-hover)');
        }
        else if (theme === 'dark') {
            root.style.setProperty('--accent', 'var(--dark-accent)');
            root.style.setProperty('--accent-2', 'var(--dark-accent-2)');
            root.style.setProperty('--accent-3', 'var(--dark-accent-3)');
            root.style.setProperty('--background', 'var(--dark-background)');
            root.style.setProperty('--background-2', 'var(--dark-background-2)');
            root.style.setProperty('--background-3', 'var(--dark-background-3)');
            root.style.setProperty('--text', 'var(--dark-text)');
            root.style.setProperty('--text-hover', 'var(--dark-text-hover)');
        }
    };
    
    

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

    return <>
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
                />
            </div>
        </div>
    </>;
};

export default NavigationHeader;

// een lege line speciaal voor luuk :)))))
