import axios from "axios";
import {useNavigate} from "react-router-dom";
const navigate = useNavigate();
export default function getType() {
    let type: string;
    const resultType = async () => {
        await axios.get("http://localhost:5099/api/login",
            {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(e => {
            type = e.data;
            localStorage.setItem('type', type);
        }).catch(e => {
            console.log(e);
            localStorage.setItem("token", null);
            navigate("/login")
        })
    }
    resultType().then();
}