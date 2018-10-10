import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import { FileCopy, PlayArrow, Stop } from "@material-ui/icons";

const styles = theme => ({
    drawerPaper: {
        position: "relative",
        height: "100vh"
    },
    toolbar: theme.mixins.toolbar
});

class Sidebar extends React.Component {
    state = {
        files: {},
        openFiles: {},
        selectedRunId: null
    };

    on_wsopen() {}

    on_wsclose() {}

    on_wsmessage(message) {
        var files = JSON.parse(message.data);
        this.setState({ files: files });
        var prevRunId = this.state.selectedRunId;
        if (prevRunId) {
            this.setState({
                selectedRunId: this.state.files[prevRunId.file][prevRunId.runId]
            });
            this.props.onProcessChange(this.state.selectedRunId);
        }
    }

    constructor(props) {
        super(props);
        this.ws = new WebSocket("ws://localhost:3001/files");
        this.ws.onopen = this.on_wsopen.bind(this);
        this.ws.onclose = this.on_wsclose.bind(this);
        this.ws.onmessage = this.on_wsmessage.bind(this);
    }

    handleClick = file => {
        this.setState({
            openFiles: {
                ...this.state.openFiles,
                [file]: !this.state.openFiles[file]
            }
        });
    };

    handleProcessClick = runId => {
        this.setState({ selectedRunId: runId });
        this.props.onProcessChange(runId);
    };

    render() {
        const { classes } = this.props;
        const { selectedRunId } = this.state;
        return (
            <Drawer
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper
                }}>
                <div className={classes.toolbar} />
                <Divider />
                {Object.keys(this.state.files).map(file => (
                    <div>
                        <ListItem
                            button
                            onClick={this.handleClick.bind(this, file)}>
                            <ListItemIcon>
                                <FileCopy />
                            </ListItemIcon>
                            <ListItemText inset primary={file} />
                            {this.state.openFiles[file] ? (
                                <ExpandLess />
                            ) : (
                                <ExpandMore />
                            )}
                        </ListItem>
                        <Collapse
                            in={this.state.openFiles[file]}
                            timeout="auto"
                            unmountOnExit>
                            {Object.keys(this.state.files[file]).map(runId => (
                                <List component="div" disablePadding>
                                    <ListItem
                                        button
                                        className={classes.nested}
                                        selected={
                                            selectedRunId &&
                                            selectedRunId.runId == runId
                                        }
                                        onClick={this.handleProcessClick.bind(
                                            this,
                                            this.state.files[file][runId]
                                        )}>
                                        <ListItemIcon>
                                            {this.state.files[file][runId]
                                                .running ? (
                                                <PlayArrow />
                                            ) : (
                                                <Stop />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText inset primary={runId} />
                                    </ListItem>
                                </List>
                            ))}
                        </Collapse>
                    </div>
                ))}
            </Drawer>
        );
    }
}

export default withStyles(styles)(Sidebar);
