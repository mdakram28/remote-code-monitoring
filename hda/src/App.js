import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Sidebar from "./components/Sidebar";
import MyAppbar from "./components/MyAppbar";
import ProcessViewer from "./codeviewer/ProcessViewer";

const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: "hidden",
        position: "relative",
        display: "flex"
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        height: "100vh",
        overflow: "auto"
    },
    appBarSpacer: theme.mixins.toolbar
});

class App extends React.Component {
    state = {
        source: null,
        selectedProcess: null,
        selectedFile: null
    };

    constructor(props) {
        super(props);
    }

    handleSourceChange = newSource => {
        this.setState({ source: newSource });
    };

    handleProcessChange = (runId) => {
        this.setState({
            selectedRunId: runId
        });
    };

    render() {
        const { classes } = this.props;
        const { tabValue, selectedRunId } = this.state;
        return (
            <React.Fragment>
                <div className={classes.root}>
                    <MyAppbar onSourceChange={this.handleSourceChange} />

                    <Sidebar
                        source={this.state.source}
                        onProcessChange={this.handleProcessChange}
                    />

                    <main className={classes.content}>
                        <div className={classes.appBarSpacer} />
                        <ProcessViewer
                            runId={selectedRunId}
                        />
                    </main>
                </div>
            </React.Fragment>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
