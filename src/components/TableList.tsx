import {useEffect, useState} from "react";

export default function TableList({ columns, data }) {
    const [sortMode, setSortMode] = useState({
        key: 0,
        desc: false
    });

    const [parsedData, setParsedData] = useState([]);

    useEffect(() => {
        const _data = [...data].sort((a, b) => {
            a = a[sortMode.key]
            b = b[sortMode.key];

            let res;

            if (typeof a === "number") {
                res = a - b;
            } else if (typeof a === "string") {
                try {
                    const dateA = new Date(a);
                    const dateB = new Date(b);

                    res = dateA.getTime() - dateB.getTime();
                } catch {
                    res = a.localeCompare(b, "en", { numeric: true, sensitivity: "base" });
                }
            } else {
                res = 0;
            }

            return sortMode.desc ? 0 - res : res;
        });

        setParsedData(_data);
    }, [data, sortMode]);

    const handleSetSort = (key) => {
        setSortMode({
            key: key,
            desc: sortMode.key == key ? !sortMode.desc : false
        })
    }

    return (<>
        <div className={"admin-users-legenda"}>
            {columns.map((k, i) => {
                if (sortMode.key !== i) {
                    return <p key={k} onClick={() => handleSetSort(i)}>{k}</p>;
                }

                return <p key={k} onClick={() => handleSetSort(i)}>{k} {sortMode.desc ? "▼" : "▲"}</p>;
            })}
        </div>
        <div className={"admin-users-list"}>
            {parsedData.map(x => (
                <div className={"admin-users-list-item"} key={x[0]}>
                    {x.map(k => <p key={k}>{k}</p>)}
                </div>)
            )}
        </div>
    </>)
}