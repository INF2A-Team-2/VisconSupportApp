import axios from "axios";

const getToken = (username: string, password: string) => {axios.post('http://localhost:5099/api/login', {username: username, password: password})
    .then(response => {
        const token = response.data.token;
        sessionStorage.setItem("token", token);
        axios.defaults.headers['Authorization'] = "Bearer: " + token;
        console.log(token);
    }).catch(err => {
    console.log(err);
    })
}

export default getToken;