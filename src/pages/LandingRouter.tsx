import { useNavigate } from "react-router-dom";

import CustomerLanding from "./CustomerLanding.tsx";
import EmployeeLanding from "./EmployeeLanding.tsx";
import AdminLanding from "./AdminLanding.tsx";
import {useEffect} from "react";
import getType from "../api/GetType.ts";

const LandingRouter = () => {
    const navigate = useNavigate();

    getType();
    const type = sessionStorage.getItem("type");

    useEffect(() => {
        if (sessionStorage.getItem("token") === null) {
            navigate("/login");
        }
    }, [navigate, type]);

    switch (type) {
        case "2":
            return (<CustomerLanding />);
        case "1":
            return (<EmployeeLanding />);
        case "0":
            return (<AdminLanding />);
    }
};

export default LandingRouter;