import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';

import { store } from '../store';


import { withStyles } from '@material-ui/core/styles'
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton'
import Left from '@material-ui/icons/KeyboardArrowLeft'
import Right from '@material-ui/icons/KeyboardArrowRight'

import Flex from '../components/Flex'
import Icon from '../components/Icon'

const styles = theme => ({
  container: {
  },
  buttonLeft: {
    marginRight: theme.spacing.unit * 2,
  },
  buttonRight: {
    marginLeft: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
})

class DatePickerComp extends React.Component {
  
  render() {
    const { classes, time } = this.props;

    return (
      <Flex className={classes.container} alignItems='center' justifyContent='center' height='100%'>
        <Hidden smDown>
          <IconButton className={classes.buttonLeft} onClick={this._stepBackward}><Icon path='chevron_left' /></IconButton>
        </Hidden>
        <Icon path='calendar' fill='#888' marginRight='5px' />
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DatePicker
            value={time}  
            format='LL'
            showTodayButton
            leftArrowIcon={<Left />}
            rightArrowIcon={<Right />}
            onChange={this._handleDateChange} />
        </MuiPickersUtilsProvider>
        <Hidden smDown>
          <IconButton className={classes.buttonRight} onClick={this._stepForward}><Icon path='chevron_right' /></IconButton>
        </Hidden>
      </Flex>
    )
  }

  _handleDateChange = (newTime=null) => {
    const { time } = this.props;
    store.dispatch({ type: 'CHANGE_TIME', payload: { time: new Date(newTime || time) }})
  }
    
  _stepBackward = () => {
    const { time } = this.props;
    this._handleDateChange(new Date(moment(time).subtract(1, 'days')))
  }
    
  _stepForward = () => {
    const { time } = this.props;
    this._handleDateChange(new Date(moment(time).add(1, 'days')))
  }

  
}

export default connect(state => {
  return {
    ...state.time
  }  
})(withStyles(styles)(DatePickerComp))