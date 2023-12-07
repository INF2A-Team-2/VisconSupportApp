import {Component} from "react";
import {toast} from "react-hot-toast";
import Dropdown from "react-dropdown";
import {Field, FieldType, Media} from "../models.ts";
import InputFile from "./InputFile.tsx";
import React from "react";

type PopupFormProps = {
    title: string;
    fields: Field[];
    submitText?: string;
    visible?: boolean;
    onSubmit: (data: object) => void;
    onCanceled?: () => void;
}

type PopupFormState = {
    visible: boolean
    data: object
    media: Array<Media>
    imageInput: React.MutableRefObject<any>
}

class PopupForm extends Component<PopupFormProps, PopupFormState> {
    state: PopupFormState = {
        visible: this.props.visible ?? false,
        data: {},
        media: [],
        imageInput: React.createRef(),
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

        if (this.state.media.length > 0) {
           this.props.onSubmit({ ...this.state.data, media: this.state.media });
        } else {
            this.props.onSubmit(this.state.data);
        }

    };

    onAddImage = () => {
        if (this.state.imageInput.current === null) {
            return;
        }

        this.state.imageInput.current.click();
    };

    deleteMedia = (i) => {
        this.setState((prevState) => ({
            ...prevState,
            media: prevState.media.filter((_, idx) => idx !== i)
        }));
    };

    onImageUpload = () => {
        if (this.state.imageInput.current === null) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            this.state.media[this.state.media.length - 1].data = reader.result as ArrayBuffer;
            this.setState((prevState) => ({ ...prevState, media: [...prevState.media] }));
        };

        Array.from(this.state.imageInput.current.files).forEach((f: File) => {
            if (f) {
                this.state.media.push({
                    name: f.name,
                    mimeType: f.type,
                });
                reader.readAsArrayBuffer(f);
            }
        });
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
            case FieldType.TextArea:
                return (
                    <div className={"popup-form-field"} key={f.key}>
                        <p>{f.name}</p>
                        <textarea onChange={e => this.handleInput(f, e.target.value)}/>
                    </div>
                );
            case FieldType.Files:
                return (
                    <div>
                        <p>{f.name}</p>
                        <input type={"file"} ref={this.state.imageInput} onChange={this.onImageUpload} style={{ display: "none" }}/>
                        <div className={"files-list"}>
                            {this.state.media.map((f, i) => (<InputFile data={URL.createObjectURL(new Blob([f.data]))} mimeType={f.mimeType} fileName={f.name} deleteCallback={() => this.deleteMedia(i)} key={i}/>))}
                        <button onClick={this.onAddImage}><i className="fa-solid fa-plus fa-2xl"></i></button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    onCanceled = () => {
        if (this.props.onCanceled) {
            this.props.onCanceled();
        }
        this.show(false);
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
                            <button onClick={this.onCanceled}>Cancel</button>
                            <button onClick={this.handleSubmit}>{this.props.submitText === undefined ? "Submit" : this.props.submitText}</button>
                        </div>
                    </div>
                </div>
            </>
        ) : null;
    }
}

export default PopupForm;
