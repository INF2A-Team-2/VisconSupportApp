import {Component} from "react";
import {toast} from "react-hot-toast";
import Dropdown from "react-dropdown";
import {Field, FieldType} from "../models.ts";

type PopupFormProps = {
    title: string;
    fields: Field[];
    onSubmit: (data: object) => void;
}

type PopupFormState = {
    visible: boolean
    data: object
}

class PopupForm extends Component<PopupFormProps, PopupFormState> {
    state: PopupFormState = {
        visible: false,
        data: {},
    };

    componentDidMount() {
        this.resetFields();
    }

    resetFields = () => {
        this.props.fields.forEach(f => this.handleInput(f, undefined));
    };

    show = (visible: boolean = true) => {
        this.setState((prevState) => ({
            ...prevState,
            visible: visible
        }));

        this.resetFields();

        document.body.style.overflow = visible ? "hidden" : "auto";
    };

    handleInput = (field: Field, value: string) => {
        let v: string | number = value;

        if (field.type === FieldType.Number
            || (field.type === FieldType.Selection && field.isNumber)
            && value !== undefined && value.length > 0)
        {
            v = parseInt(value);
        }

        this.setState((prevState) => ({
            ...prevState,
            data: {
                ...prevState.data,
                [field.key]: v,
            },
        }));
    };

    handleSubmit = () => {
        let failed = false;

        for (const [k, v] of Object.entries(this.state.data)) {
            const f = this.props.fields.find(f => f.key === k);

            if (f === undefined) {
                continue;
            }

            if (f.required && (v === undefined || v.length === 0)) {
                toast.error(`${f.name} is required`);
                failed = true;
            }
        }

        if (failed) {
            return;
        }

        this.props.onSubmit(this.state.data);
    };

    getField = (f: Field) => {
        switch (f.type) {
            case FieldType.Text:
                return (
                    <div className={"popup-form-field"} key={f.key}>
                        <p>{f.name}</p>
                        <input type={"text"} onChange={e => this.handleInput(f, e.target.value)}/>
                    </div>
                );
            case FieldType.Password:
                return (
                    <div className={"popup-form-field"} key={f.key}>
                        <p>{f.name}</p>
                        <input type={"password"} autoComplete={"new-password"} onChange={e => this.handleInput(f, e.target.value)}/>
                    </div>
                );
            case FieldType.Number:
                return (
                    <div className={"popup-form-field"} key={f.key}>
                        <p>{f.name}</p>
                        <input type={"number"} onChange={e => this.handleInput(f, e.target.value)}/>
                    </div>
                );
            case FieldType.Selection:
                return (
                    <div className={"popup-form-field"} key={f.key}>
                        <p>{f.name}</p>
                        <Dropdown options={f.options} onChange={e => this.handleInput(f, e.value)} />
                    </div>
                );
            default:
                return null;
        }
    };

    render() {
        return this.state.visible ? (
            <>
                <div className={"popup-form-container"}>
                    <div className={"popup-form"}>
                        <h1>{this.props.title}</h1>
                        <div className={"popup-form-field-list"}>
                            {this.props.fields.map(this.getField)}
                        </div>
                        <div className={"popup-form-footer"}>
                            <button onClick={() => this.show(false)}>Cancel</button>
                            <button onClick={this.handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </>
        ) : null;
    }
}

export default PopupForm;