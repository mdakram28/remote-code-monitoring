import React from "react";
import { Style } from "react";
import { fetchTimeline } from "../fetchfiles";
import SimpleLineChart from "./SimpleLineChart";

class MemoryGraph extends React.Component {
    // state = {
    //     timeline: []
    // };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <SimpleLineChart
                    data={this.props.timeline}
                    xkey={"time"}
                    ykey={"memory"}
                />
            </div>
        );
    }
}

export default MemoryGraph;
