import React from "react";
import { Style } from "react";
import { Line } from "rc-progress";
import Typography from "@material-ui/core/Typography";

class CodeView extends React.Component {
    format_count(count) {
        if (count == "-") count = "";
        else if (count == "#####") {
            count = "";
            // this.refs.code-view.style.color = "red";
        }
        return count;
    }

    format_code(code) {
        return code;
    }

    constructor(props) {
        super(props);
    }

    render() {
		const { stats } = this.props;
		if (!stats) return <span>Loading...</span>;
		
        const percent = stats.progress[stats.source] ? stats.progress[stats.source].percent : 0;

        return (
            <div>
                <Typography variant="headline" gutterBottom>
                    {stats.source} - {percent}%
                </Typography>
                <Line
                    percent={percent}
                    strokeWidth="1"
                    strokeColor={"#3FC7FA"}
                    style={{ width: "100%" }}
                />
                <table class="code-view" cellspacing="0">
                    <tr>
                        <th class="lineno" col>
                            Line No
                        </th>
                        <th class="count">Count Data</th>
                        <th class="code">Lines of Code</th>
                    </tr>
                    {stats.lines.map((line, index) => (
                        <tr
                            className={
                                line.count == "#####"
                                    ? "red"
                                    : line.count == "-"
                                        ? ""
                                        : "green"
                            }>
                            <td class="lineno">{index + 1}</td>
                            <td class="count">
                                {this.format_count(line.count)}
                            </td>
                            <td class="code">
                                <pre>{this.format_code(line.code)}</pre>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        );
    }
}

export default CodeView;
