import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {User} from "../models.ts";

export default function useAuth() {
    const navigate = useNavigate();

    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (token === null) {
            navigate("/login");
            return;
        }

        axios.get("http://localhost:5099/api/login", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            if (response.status !== 200) {
                sessionStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setUser(response.data);
        })

    }, [navigate])

    return user;
}

export async function getToken(username: string, password: string) : Promise<boolean> {
    const res = await axios.post("http://localhost:5099/api/login", {
        username: username,
        password: password
    });

    if (res.status !== 200) {
        return false;
    }

    sessionStorage.setItem("token", res.data.token);

    return true;
}