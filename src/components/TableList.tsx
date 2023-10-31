import {useEffect, useState} from "react";

export default function TableList({ columns, data, buttons = [], defaultSort = {key: 0, desc: false}}) {
    const [sortMode, setSortMode] = useState(defaultSort);
    const [searchQuery, setSearchQuery] = useState("");

    const [parsedData, setParsedData] = useState([]);

    useEffect(() => {
        const _data = [...data].sort((a, b) => {
            a = a[sortMode.key]
            b = b[sortMode.key];

            let res;

            if (typeof a === "number") {
                res = a - b;
            } else if (typeof a === "string") {
                const dateA = new Date(a);
                const dateB = new Date(b);

                if (isNaN(dateA.getTime())) {
                    const sA = a.toLowerCase();
                    const sB = b.toLowerCase();
                    if (sA.toLowerCase() > sB) {
                        res = -1;
                    } else if (sA < sB) {
                        res = 1;
                    } else {
                        res = 0;
                    }
                } else {
                    res = dateA.getTime() - dateB.getTime();
                }
            } else {
                res = 0;
            }

            return sortMode.desc ? 0 - res : res;
        });

        setParsedData(searchQuery.length === 0
            ? _data
            : _data.filter(x => x.some(y => y?.toString().includes(searchQuery))));

    }, [data, sortMode, searchQuery]);

    const handleSetSort = (key) => {
        setSortMode({
            key: key,
            desc: sortMode.key == key ? !sortMode.desc : false
        })
    };
    return (<div className={"tablelist"}>
        <input className={"tablelist-search"}
               type={"text"}
               placeholder={"Search..."}
               onChange={e => setSearchQuery(e.target.value)}/>
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
                    {x.map((k, i) => <p key={i}>{k}</p>)}
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