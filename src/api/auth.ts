import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {AccountType, User} from "../models.ts";
import config from "../../config.json";

export const SERVER_URL = config.server_url;

export default function useAuth(allowedTypes: Array<AccountType> = []) {
    const navigate = useNavigate();

    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (token === null) {
            navigate("/login");
            return;
        }

        axios.get(SERVER_URL + "/api/login", RequestConfig())
            .then(response => {
                setUser(response.data);

                if (allowedTypes.length > 0 && !allowedTypes.includes(response.data.type)) {
                    navigate("/403");
                }
        }).catch(() => {
            sessionStorage.removeItem("token");
            navigate("/login");
            return;
        });

    }, [navigate]);

    return user;
}

export async function getToken(username: string, password: string) : Promise<boolean> {
    const res = await axios.post(SERVER_URL + "/api/login", {
        username: username,
        password: password
    });

    if (res.status !== 200) {
        return false;
    }

    sessionStorage.setItem("token", res.data.token);
    return true;
}

export const RequestConfig = () => {
    return {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    };
};
