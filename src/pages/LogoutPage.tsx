import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";

const LogoutPage = (): JSX.Element => {
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem("token");
        navigate("/login");
    }, [navigate]);

    return <>
    </>;
};

export default LogoutPage;
