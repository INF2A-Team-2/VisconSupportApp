import {Component} from "react";
import { Field, FieldType } from "../models";
import toast from "react-hot-toast";
import PopupForm from "./PopupForm";
import { FilePreview } from "./InputFile";

type PopupRoadmapProps = {
    title: string;
    forms: Field[][];
    onSubmit: (data: object) => void;
}

type PopupRoadmapState = {
    visible: boolean,
    data: object,
    currentForm: number,
    isLastForm: boolean,
    dataHistory: string[],
    done: boolean,
}

class RoadmapPopup extends Component<PopupRoadmapProps, PopupRoadmapState> {
    state: PopupRoadmapState = {
        visible: false,
        data: {},
        currentForm: 0,
        isLastForm: false,
        dataHistory: [],
        done: false,
    };

    start = () => {
        var last = false;
        if (this.state.currentForm === this.props.forms.length - 1) {
            last = true;
        }

        this.setState((prevState) => ({
            ...prevState,
            visible: true,
            isLastForm: last,
        }));

        document.body.style.overflow = "auto";
    };

    stop = () => {
        this.setState((prevState) => ({
            ...prevState,
            visible: false,
        }));

        this.state.currentForm = 0;
        this.state.dataHistory = [];
        document.body.style.overflow = "auto";
    }

    handleSubmit = (data) => {
        let failed = false;

        for (const [k, v] of Object.entries(this.state.data)) {
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

        var prev = data[this.props.forms[this.state.currentForm][0].key];
        if (prev !== undefined) {
            var media = data["media"];
            if (media !== undefined) {
                this.state.dataHistory[this.state.currentForm] = media;
            } else {
                this.state.dataHistory[this.state.currentForm] = prev;
            }
        }

        this.setState((prevState) => ({
            ...prevState,
            data: { ...prevState.data, ...data }
        }));

        if (this.state.isLastForm) {
            this.setState((prevState) => ({
                ...prevState,
                currentForm: prevState.currentForm + 1,
                isLastForm: last,
                done: true,
            }));
            return;
        } else {
            var last = false;

            if (this.state.currentForm + 1 === this.props.forms.length - 1) {
                last = true;
            }

            this.setState((prevState) => ({
                ...prevState,
                currentForm: prevState.currentForm + 1,
                isLastForm: last,
            }));
        }
    };

    onPrevious = () => {
        if (this.state.currentForm === 0) {
            toast.error("You are already on the first form");
            return;
        }

        this.setState((prevState) => ({
            ...prevState,
            currentForm: prevState.currentForm - 1,
            isLastForm: this.state.currentForm - 1 === this.props.forms.length - 1,
            done: false,
        }));
    };

    render() {
        if (this.state.done && this.state.visible) {
            if (this.state.data["media"] === undefined) {
                delete this.state.data["media"];
            }
            return (
            <>
                <div className={"popup-form-container"}>
                    <div className={"popup-form"}>
                        <h1>{this.props.title}</h1>
                        <div className={"popup-form-field-list"}>
                            <p>Your data:</p>
                            <ul>
                                {Object.entries(this.state.data).map(([k, v]) => {
                                    let type = this.props.forms.find(f => f[0].key === k)[0].type;
                                    if (type === FieldType.Files) {
                                        if (v === undefined) {
                                            console.log(this.state.data["media"]);
                                            return;
                                        }
                                        return <div>
                                            <p>Files:</p>
                                            {v.map((f, i) => (<FilePreview data={URL.createObjectURL(new Blob([f.data]))}
                                                                    mimeType={f.mimeType} fileName={f.name} key={i}/>))}
                                        </div>;
                                    } else {
                                        let title = "";
                                        this.props.forms.forEach(f => {
                                            if (f[0].key === k) {
                                                title = f[0].name;
                                            }
                                        });
                                        return <li key={k}>{title}: {v}</li>
                                    }

                                })}
                            </ul>
                        </div>
                        <div className={"popup-form-footer"}>
                            <button onClick={this.stop}>Cancel</button>
                            <button onClick={this.onPrevious}>Previous</button>
                            <button onClick={() => this.props.onSubmit(this.state.data)}>Are you sure?</button>
                        </div>
                    </div>
                </div>
            </>)
        } else if (this.state.visible) {
            return (
            <>
                <PopupForm
                    title={this.props.title + " - " + (this.state.currentForm + 1) + "/" + this.props.forms.length}
                    fields={this.props.forms[this.state.currentForm]}
                    submitText={this.state.isLastForm ? "Submit" : "Next"}
                    onSubmit={this.handleSubmit}
                    visible={true}
                    default={this.state.dataHistory[this.state.currentForm]}
                    onCanceled={this.stop}
                    onPrevious={this.onPrevious}
                />
            </>
            )
        } else {
            return null;
        }
    }
}

export default RoadmapPopup;