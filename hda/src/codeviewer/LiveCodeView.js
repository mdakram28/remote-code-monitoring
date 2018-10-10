import React from "react";
import { Style } from "react";
import CodeView from "./CodeView";
import { Line } from "rc-progress";
import Typography from "@material-ui/core/Typography";
import { Done } from "@material-ui/icons";

class LiveCodeView extends React.Component {
    state = {
        data: null
    };

    on_wsopen() {}

    on_wsclose() {}

    on_wsmessage(message) {
		var data = JSON.parse(message.data);
		console.log(data);
        this.setState({
            data
        });
    }

    constructor(props) {
        super(props);
    }

    openConnection = () => {
        if (this.ws) {
            this.ws.close();
        }
        this.ws = new WebSocket(
            "ws://localhost:3001/live/" +
                this.props.runId.file +
                "/" +
                this.props.runId.runId
        );
        this.ws.onopen = this.on_wsopen.bind(this);
        this.ws.onclose = this.on_wsclose.bind(this);
        this.ws.onmessage = this.on_wsmessage.bind(this);
    };

    componentDidMount() {
        this.openConnection();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.runId != this.props.runId) {
            this.openConnection();
            this.setState({
                data: null
            });
        }
    }

    componentWillUnmount() {
        this.ws.close();
    }

    render() {
        if (!this.props.runId.running) {
            return (
                <Typography variant="display1" color="error" gutterBottom>
                    The process has ended
                </Typography>
            );
        }
        return (
            <div>
                <CodeView stats={this.state.data} />
            </div>
        );
    }
}

export default LiveCodeView;
