import {useEffect, useState} from "react";

const Test = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
       fetch("https://localhost:7183/api/test")
           .then(response => {
               console.log(response);
               if (response.status !== 200) {
                   return;
               }

               response.json().then(data => {
                   console.log(data);
                   setData(data);
               });
           });
    }, []);

    return (
        <>
            <a href="/">Home</a>
            <p>{JSON.stringify(data)}</p>
        </>
    );
}

export default Test;