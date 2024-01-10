import React, {Component} from "react";

type SliderProps = {
    values: string[],
    default?: number
    onChange: (value: any) => void,
}

type SliderState = {
    currentValue: number
}

class Slider extends Component<SliderProps, SliderState> {
    state: SliderState = {
        currentValue: this.props.default ?? 0
    };



    render() {
        return <>
            <div className={"slider"}>
                <input type={"range"} min={0} max={this.props.values.length - 1} step={1} defaultValue={this.props.default ?? 0} onChange={(v) => {this.props.onChange(v.target.value)}}/>
                <div className={"slider-labels"}>
                    {this.props.values.map((v, i) => <p key={i}>{v}</p>)}
                </div>
            </div>
        </>;
    }
}

export default Slider;