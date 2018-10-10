import React from "react";
import { fetchSources } from "../fetchfiles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

class SourcesList extends React.Component {
  state = {
	sources: [],
	open: true,
	selectedValue: null
  };

  constructor(props) {
    super(props);
    fetchSources().then(sources => {
      this.setState({ sources: sources, selectedValue: sources[0] });
    });
  }

  handleClose = value => {
	this.setState({ selectedValue: value, open: false });
	this.props.onSourceChange(value);
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  render() {
    return (
      <div>
		<Button color="inherit" onClick={this.handleClickOpen}>Select Project</Button>
        <SourcesListDialog
          selectedValue={this.state.selectedValue}
          open={this.state.open}
		  onClose={this.handleClose}
		  sources={this.state.sources}
        />
      </div>
    );
  }
}

class SourcesListDialog extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        {...other}>
        <DialogTitle id="simple-dialog-title">
          Select Project Source Folder
        </DialogTitle>
        <div>
          <List>
            {this.props.sources.map(source => (
              <ListItem
                button
                onClick={() => this.handleListItemClick(source)}
                key={source}>
                <ListItemText primary={source} />
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    );
  }
}

export default SourcesList;
