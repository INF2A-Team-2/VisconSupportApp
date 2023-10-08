import { useNavigate } from "react-router-dom";

import CustomerLanding from "./CustomerLanding.tsx";
import EmployeeLanding from "./EmployeeLanding.tsx";
import AdminLanding from "./AdminLanding.tsx";
import {useEffect} from "react";
import axios from "axios";

const LandingRouter = () => {
    const navigate = useNavigate();

    let type: any;
    if (localStorage.getItem("type") === null){
        axios.get("http://localhost:5099/api/login",
            {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(e => {
            type = e.data;
            localStorage.setItem('type', type);
        }).catch(e => {
            console.log(e);
            localStorage.setItem("token", null);
            navigate("/login")
        })
    }else{
        type = localStorage.getItem("type");
    }

    useEffect(() => {
        if (localStorage.getItem("token") === null) {
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