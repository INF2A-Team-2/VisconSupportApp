import {useState} from "react";

const SelectButton = ({
                          title,
                          value,
                          onChange,
                          isSelected = false
} : {
    title: string,
    value: string | number,
    onChange: (i: string | number) => void,
    isSelected? : boolean
}) => {
    const [selected, setSelected] = useState(isSelected);

    const handleChange = () => {
        setSelected(!selected);

        onChange(value);
    };

    return (<>
        <div key={value} className={"select-button"} onClick={handleChange}>
            <p>{title}</p>
            {selected && <p>✔</p>}
        </div>
    </>);
};

export default SelectButton;