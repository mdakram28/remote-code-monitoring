import React from "react";
import { Style } from "react";
import CodeView from "./CodeView";
import Slider from "@material-ui/lab/Slider";
import { withStyles } from "@material-ui/core/styles";
import Moment from "moment";

class TimelineCodeView extends React.Component {
    state = {
        data: null,
        value: 0,
        percent: 50,
        color: "#3FC7FA"
    };

    handleChange(event, value) {
        //   console.log("timeline...", this.state.timeline[this.state.timelineKeys[value]]);
        try {
            this.setState({
                value: value
            });
        } catch (err) {}
    }

    constructor(props) {
        super(props); // file
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(newProps) {
        // if (this.props.timeline != newProps.timeline) {
        // 	this.setState({
        // 		timelineKeys: Obec
        // 	});
        // }
    }

    render() {
        const { timeline } = this.props;
		const { value } = this.state;
		
        if (timeline == null) return <span>Loading ...</span>;
        const timelineKeys = Object.keys(timeline);
        const data = timeline[timelineKeys[value]];
        var date = new Date(parseInt(timelineKeys[this.state.value]));

        const containerStyle = {
            width: "250px"
        };
        return (
            <div>
                <Slider
                    value={this.state.value}
                    min={0}
                    max={timelineKeys.length - 1}
                    step={1}
                    onChange={this.handleChange}
                    //   style={{position: "fixed"}}
                />
                Time : {Moment(date).format("YYYY-MM-ddd HH:mm:ss.SSS")}
                <hr />
                <div>
                    <CodeView stats={data} />
                </div>
            </div>
        );
    }
}

export default TimelineCodeView;
