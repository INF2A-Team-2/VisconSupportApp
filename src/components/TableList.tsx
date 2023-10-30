import {useEffect, useState} from "react";

export default function TableList({ columns, data, buttons = []}) {
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

    return (<div className={"tablelist"}>
        <div className={"tablelist-legenda"}
             style={{
                 gridTemplateColumns: `repeat(${columns.length}, minmax(50px, 1fr)) ${buttons.length !== 0 ? `${32 * buttons.length}px` : ""}`
             }}>
            {columns.map((k, i) => {
                if (sortMode.key !== i) {
                    return <p key={k} onClick={() => handleSetSort(i)}>{k}</p>;
                }

                return <p key={k} onClick={() => handleSetSort(i)}>{k} {sortMode.desc ? "▼" : "▲"}</p>;
            })}
        </div>
        <div className={"tablelist-list"}>
            {parsedData.map(x => (
                <div className={"tablelist-list-item"}
                     key={x[0]}
                     style={{
                         gridTemplateColumns: `repeat(${columns.length}, minmax(50px, 1fr)) ${buttons.length !== 0 ? `${32 * buttons.length}px` : ""}`
                     }}>
                    {x.map(k => <p key={k}>{k}</p>)}
                    <div className={"tablelist-buttons-wrapper"}>
                        {buttons.map((b, i) => <button className={"tablelist-button"} onClick={() => b.callback(x[0])} key={i}>
                            {b.text}
                        </button>)}
                    </div>
                </div>)
            )}
        </div>
    </div>)
}