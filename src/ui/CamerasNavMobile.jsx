import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class CamerasNavMobile extends React.Component {

  state = {
    selected: '',
  }

  handleChange = event => {
    console.debug('event >>> ', event.target.name, event.target.value)
    this.setState({ selected: event.target.value });
  };

  render() {
    const { match, locations, classes, selectedLocation } = this.props;
    const { selected } = this.state;

    console.debug('selectedLocation >>> ', selectedLocation)

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <Select value={selected} onChange={this.handleChange} inputProps={{ name: 'id', id: 'age-simple' }}>
            {
              locations.map(loc => <MenuItem key={loc.id} value={loc.id}><NavLink  to={`${match.url}/${loc.id}`} activeClassName="active">{loc.name}</NavLink></MenuItem>)
            }
          </Select>
        </FormControl>
      </form>
    )
  }
    
}

export default withRouter(withStyles(styles)(CamerasNavMobile))