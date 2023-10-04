import { useNavigate } from "react-router-dom";

import CustomerLanding from "./CustomerLanding.tsx";
import EmployeeLanding from "./EmployeeLanding.tsx";
import AdminLanding from "./AdminLanding.tsx";
import {useEffect} from "react";

const LandingRouter = () => {
    const navigate = useNavigate();

    let user = { type: "customer" };
    //let user = null;

    useEffect(() => {
        if (user === null) {
            navigate("/login");
        }
    }, [navigate, user]);

    switch (user?.type) {
        case "customer":
            return (<CustomerLanding />);
        case "employee":
            return (<EmployeeLanding />);
        case "admin":
            return (<AdminLanding />);
    }
};

export default LandingRouter;