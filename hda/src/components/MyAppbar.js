import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SourcesList from "./SourcesList.";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  grow: {
    flexGrow: 1
  }
});

class MyAppbar extends React.Component {
	

  render() {
    const { classes } = this.props;
    return (
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <Typography
            variant="title"
            color="inherit"
            noWrap
            className={classes.grow}>
            Honeywell Developer Assistant
          </Typography>
          <SourcesList onSourceChange={this.props.onSourceChange} />
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(MyAppbar);
