import React from "react";
import { Component } from "react";

export enum StyleMode {
    None,
    Numbered,
    Dash,
    Quote
}

export enum InputType {
    Chat,
    Popup
}

type MarkdownInputProps = {
    type: InputType;
    onChange?: (message: string) => void;
    value?: string;
};

type MarkdownInputState = {
    message: string;
    textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
    styleMode: StyleMode;
    listCount: number;
};

class MarkdownInput extends Component<MarkdownInputProps, MarkdownInputState> {
    constructor(props: MarkdownInputProps) {
        super(props);
        this.state = {
            message: this.props.value || "",
            textareaRef: React.createRef<HTMLTextAreaElement>(),
            styleMode: StyleMode.None,
            listCount: 1
        };
    }

    newLine = () => {
        if (this.state.styleMode == StyleMode.None)
            return;

        if (this.state.styleMode == StyleMode.Quote) {
            this.setState({
                message: this.state.message + "\n",
                styleMode: StyleMode.None});
            return;
        }

        const lines = this.state.message.split("\n");
        if (this.state.styleMode == StyleMode.Numbered && lines[lines.length - 2] == `${this.state.listCount - 1}. `) {
            this.setState((prevState) => ({
                ...prevState,
                listCount: 1,
                styleMode: StyleMode.None,
                message: lines.splice(0, lines.length - 2).join("\n") + "\n"}));
        } else if (this.state.styleMode == StyleMode.Numbered) {
            this.setState((prevState) => ({
                ...prevState,
                listCount: this.state.listCount + 1}));
            this.insertTextAtLine(`${this.state.listCount}.`);
        } else if (this.state.styleMode == StyleMode.Dash && lines[lines.length - 2] == "- ") {
            this.setState((prevState) => ({
                ...prevState,
                styleMode: StyleMode.None,
                message: lines.splice(0, lines.length - 2).join("\n") + "\n"}));
        } else if (this.state.styleMode == StyleMode.Dash)
            this.insertTextAtLine("-");
    };

    insertTextAtLine = (style: string) => {
        if (this.state.textareaRef.current) {
            const textarea = this.state.textareaRef.current;
            const start = textarea.selectionStart;
            const lines = this.state.message.split('\n');
            const lineIndex = this.state.message.substring(0, start).split('\n').length - 1;
            if (lineIndex < lines.length) {
                lines[lineIndex] = style + " " + lines[lineIndex];
                const newText = lines.join('\n');
                this.onChange({target: {value: newText}});
                textarea.focus();
            }
        }
    };

    surroundWord = (style: string) => {
        if (this.state.textareaRef.current) {
            const textarea = this.state.textareaRef.current;
            const start = textarea.selectionStart;
            const lines = this.state.message.split("\n");

            let messageIndex = 0;
            let found = false;
            for (let x = 0; x < lines.length; x++) {
                const words = lines[x].split(" ");
                for (let y = 0; y < words.length; y++) {
                    const word = words[y];
                    messageIndex += word.length + 1;
                    if (word == "\n")
                        continue;

                    if (start < messageIndex) {
                        words[y] = style + word + style;
                        found = true;
                        break;
                    }
                }
                lines[x] = words.join(" ");
                if (found)
                    break;
            }
            this.onChange({target: {value: lines.join("\n")}});
        }
    };

    onChange = (e) => {
        this.setState((prevState) => ({...prevState, message: e.target.value}))
        if (this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    };

    render() {
        return (
            <div>
                <div className={this.props.type == InputType.Chat ? "message-options" : "markdown-options"}>
                    <div className="text-icon" onClick={() => {this.insertTextAtLine("###");}}>
                        <i className="fa-solid fa-heading"/>
                    </div>
                    <div className="text-icon" onClick={() => {this.surroundWord("**");}}>
                        <i className="fa-solid fa-bold"/>
                    </div>
                    <div className="text-icon" onClick={() => {this.surroundWord("_");}}>
                        <i className="fa-solid fa-italic"/>
                    </div>
                    <div className="text-icon" onClick={() => {this.insertTextAtLine(">"); this.setState({styleMode: StyleMode.Quote});}}>
                        <i className="fa-solid fa-quote-left"/>
                    </div>
                    <div className="text-icon" onClick={() => {this.setState({styleMode: StyleMode.Numbered}); this.newLine();}}>
                        <i className="fa-solid fa-list-ol"/>
                    </div>
                    <div className="text-icon" onClick={() => {this.setState({styleMode: StyleMode.Dash}); this.newLine();}}>
                        <i className="fa-solid fa-list-ul"/>
                    </div>
                </div>
                <div className={this.props.type == InputType.Chat ? "message-input" : "markdown-input"}>
                    <textarea placeholder={"..."}
                        rows={8}
                        value={this.state.message}
                        ref={this.state.textareaRef}
                        onChange={this.onChange}
                        onKeyUp={(e) => {if (e.key == "Enter") this.newLine();}}/>
                </div>
            </div>
        );
    }
}

export default MarkdownInput;