import {Component} from "react";
import { Field, FieldType } from "../models";
import toast from "react-hot-toast";
import PopupForm from "./PopupForm";

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
}

class RoadmapPopup extends Component<PopupRoadmapProps, PopupRoadmapState> {
    state: PopupRoadmapState = {
        visible: false,
        data: {},
        currentForm: 0,
        isLastForm: false,
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

        this.setState((prevState) => ({
            ...prevState,
            data: { ...prevState.data, ...data }
        }));

        if (this.state.isLastForm) {
            this.props.onSubmit(data);
        } else {
            var last = false;

            if (this.state.currentForm  + 1 === this.props.forms.length - 1) {
                last = true;
            }

            this.setState((prevState) => ({
                ...prevState,
                currentForm: prevState.currentForm + 1,
                isLastForm: last,
            }));
        }
    };

    render() {
        return this.state.visible ? (
        <>
            <PopupForm
                title={this.props.title + " - " + (this.state.currentForm + 1) + "/" + this.props.forms.length}
                fields={this.props.forms[this.state.currentForm]}
                submitText={this.state.isLastForm ? "Submit" : "Next"}
                onSubmit={this.handleSubmit}
                visible={true}
                onCanceled={this.stop}
            />
        </>
        ) : null;
    }
}

export default RoadmapPopup;