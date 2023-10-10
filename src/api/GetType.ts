import axios from "axios";
export default function getType() {
    const resultType = async () => {
        await axios.get("http://localhost:5099/api/login",
            {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(e => {
            let type = e.data;
            sessionStorage.setItem('type', type);
        }).catch(e => {
            console.log(e);
            // sessionStorage.setItem("token", null);
            //navigate("/login")
        })
    }
    resultType().then();
}