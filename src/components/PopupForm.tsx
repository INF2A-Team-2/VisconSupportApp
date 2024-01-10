import React, {Component} from "react";
import {toast} from "react-hot-toast";
import Dropdown from "react-dropdown";
import {Field, FieldType, Media} from "../models.ts";
import InputFile, {FilePreview} from "./InputFile.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Slider from "./Slider.tsx";

type PopupFormProps = {
    title: string;
    forms: Field[][];
    onSubmit: (data: object) => void;
}

type PopupFormState = {
    visible: boolean
    currentData: object
    media: Array<Media>
    imageInput: React.MutableRefObject<any>,
    currentForm: number,
    isLastForm: boolean,
    dataHistory: object[],
    done: boolean,
}

class PopupForm extends Component<PopupFormProps, PopupFormState> {
    state: PopupFormState = {
        visible: false,
        currentData: {},
        media: [],
        imageInput: React.createRef(),
        currentForm: 0,
        isLastForm: false,
        dataHistory: [],
        done: false,
    };

    componentDidMount() {
        this.resetFields();
    }

    resetFields = () => {
        if (this.props.forms[this.state.currentForm] === undefined) {
            return;
        }
        this.props.forms[this.state.currentForm].forEach(f => this.handleInput(f, undefined));
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
            || field.type == FieldType.Slider
            || (field.type === FieldType.Selection && field.isNumber)
            && value !== undefined && value.length > 0)
        {
            v = parseInt(value);
        }

        this.setState((prevState) => ({
            ...prevState,
            currentData: {
                ...prevState.currentData,
                [field.key]: v,
            },
        }));
    };

    setData = (data) => {
        this.setState({ currentData: data });
    };


    handleSubmit = () => {
        if (this.state.done) {
            var data = {};
            this.state.dataHistory.forEach(d => {
                data = {...data, ...d};
            });
            if (this.state.media.length > 0) {
                this.props.onSubmit({ ...data, media: this.state.media });
            } else {
                this.props.onSubmit(data);
            }
        }

        let failed = false;

        for (const f of this.props.forms[this.state.currentForm]) {
            if (f.required && (this.state.currentData[f.key] === undefined || this.state.currentData[f.key].length === 0)) {
                if (this.state.dataHistory[this.state.currentForm] === undefined && this.state.dataHistory[this.state.currentForm][f.key] === undefined) {
                    toast.error(`${f.name} is required`);
                    failed = true;
                }
            }
        }

        if (failed) {
            return;
        }

        for (const [k, v] of Object.entries(this.state.currentData)) {
            const f = this.props.forms[this.state.currentForm].find(f => f.key === k);
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

        if (this.props.forms.length === 1) {
            this.props.onSubmit(this.state.currentData);
            return;
        }

        if (this.state.dataHistory[this.state.currentForm] !== undefined && Object.keys(this.state.currentData).length > 0) {
            this.state.dataHistory[this.state.currentForm] = this.state.currentData;
        } else if (Object.keys(this.state.currentData).length > 0) {
            this.setState((prevState) => ({ ...prevState, dataHistory: [...prevState.dataHistory, prevState.currentData] }));
        }

        this.setState((prevState) => ({
            ...prevState,
            currentForm: prevState.currentForm + 1,
            currentData: {},
        }));

        if (this.state.currentForm + 1 === this.props.forms.length) {
            this.setState((prevState) => ({
                ...prevState,
                currentForm: prevState.currentForm,
                done: true,
            }));
        } else if (this.state.currentForm + 1 === this.props.forms.length - 1) {
            this.setState((prevState) => ({
                ...prevState,
                currentForm: prevState.currentForm,
                isLastForm: true,
            }));
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
        let prevValue = undefined;
        if (this.state.dataHistory[this.state.currentForm] !== undefined) {
            prevValue = this.state.dataHistory[this.state.currentForm][f.key];
        }

        switch (f.type) {
            case FieldType.Text:
                return (
                    <div className={"popup-form-field"} key={f.key}>
                        <p>{f.name}</p>
                        <input type={"text"}
                            onChange={e => this.handleInput(f, e.target.value)}
                            defaultValue={this.state.currentData[f.key] ?? ''}/> 
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
                        <textarea
                            onChange={e => this.handleInput(f, e.target.value)}
                            defaultValue={prevValue ?? ""}/>
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

            case FieldType.Slider:
                if (this.state.currentData[f.key] === undefined) {
                    this.handleInput(f, "0");
                }

                return (
                    <div>
                        <p>{f.name}</p>
                        <Slider values={f.sliderValues} default={0} onChange={v => {this.handleInput(f, v.toString());}}></Slider>
                    </div>
                );
            default:
                return null;
        }
    };

    onCanceled = () => {
        this.setState((prevState) => ({
            ...prevState,
            currentData: {},
            media: [],
            imageInput: React.createRef(),
            currentForm: 0,
            isLastForm: false,
            dataHistory: [],
            done: false,
        }));
        this.show(false);
    };

    onPrevious = () => {
        this.setState((prevState) => ({
            ...prevState,
            currentForm: prevState.currentForm - 1,
            isLastForm: this.state.currentForm - 1 === this.props.forms.length - 1,
            done: false,
        }));
    };

    render() {
        if (this.state.done && this.state.visible) {
            return (
                <>
                    <div className={"popup-form-container"}>
                        <div className={"popup-form"}>
                            <div className={"popup-form-header"}>
                                <h1>{this.props.title}</h1> <button onClick={this.onCanceled}><i className="fa-solid fa-x"></i></button>
                            </div>
                            <div className={"popup-form-field-list"}>
                                <ul>
                                    {Object.entries(this.state.dataHistory).map(([_, d]) => {
                                        return Object.entries(d).map(([k, v]) => {
                                            let title = "";
                                            let type = FieldType.Text;
                                            let index = 0;
                                            this.props.forms.forEach(f => {
                                                if (f[0].key === k) {
                                                    title = f[0].name;
                                                    type = f[0].type;
                                                    index = this.props.forms.indexOf(f);
                                                }
                                            });

                                            if (type as FieldType === FieldType.Slider) {
                                                v = this.props.forms[index][0].sliderValues[parseInt(v)];
                                            }

                                            return <li key={k}>
                                                <p className={"text-bold"}>{title}</p>
                                                <p>{v}</p>
                                            </li>
                                        })}
                                    )}
                                </ul>
                                {this.state.media.length > 0 ?
                                    <div>
                                        <p>Files:</p>
                                        {this.state.media.map((f, i) => (<FilePreview data={URL.createObjectURL(new Blob([f.data]))}
                                                                                mimeType={f.mimeType} fileName={f.name} key={i}/>))}
                                    </div> : null}
                            </div>
                            <div className={"popup-form-footer"}>
                                <button onClick={this.onPrevious}><FontAwesomeIcon icon={"arrow-left"}/></button>
                                <button onClick={this.handleSubmit}><FontAwesomeIcon icon={"check"}/></button>
                            </div>
                        </div>
                    </div>
                </>)
        } else if (this.state.visible) {
            return (
                <>
                    <div className={"popup-form-container"}>
                        <div className={"popup-form"}>
                            <div className={"popup-form-header"}>
                                <h1>{this.props.forms.length > 0 ? this.props.title + " - " + (this.state.currentForm + 1) + "/" + this.props.forms.length : this.props.title}</h1>
                                <button onClick={this.onCanceled}><i className="fa-solid fa-x"></i></button>
                            </div>
                            <div className={"popup-form-field-list"}>
                                {this.props.forms[this.state.currentForm].map(this.getField)}
                            </div>
                            <div className={"popup-form-footer"}>
                                {this.state.currentForm !== 0 ? <button onClick={this.onPrevious}><FontAwesomeIcon icon={"arrow-left"}/></button> : <div></div>}
                                <button onClick={this.handleSubmit}>{this.state.currentForm - 1 >= this.props.forms.length - 2 ? <FontAwesomeIcon icon={"check"}/> : <FontAwesomeIcon icon={"arrow-right"}/>}</button>
                            </div>
                        </div>
                    </div>
                </>
            )
        } else {
            return null;
        }
    }
}

export default PopupForm;
