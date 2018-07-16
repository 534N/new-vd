import React from 'react';
import { connect } from 'react-redux';
// import moment from 'moment';
import numeral from 'numeral';
import axios from 'axios';


import { store } from '../store'
import Platform from '../api/Platform';


/* ACTIONS */
// import FilterActions from 'actions/FilterActions';
// import { fetchHistogram, changeHistogramRange } from './rdx/actions';
// /* STORE */
// import AuthStore from 'stores/AuthStore';
// import LocationStore from 'stores/LocationStore';
/* MUI */
// import IconButton from 'material-ui/IconButton';
/* D3 COMPONENTS */
// import BarChart from './BarChart.';
// import NoEventMessage from 'filter/NoEventMessage.react';
// import Flex from 'components/Flex/Flex';
/* UTILS */
// import VDDate from 'utils/DateUtil';
/* MISC */
/* SASS */
import '../css/histogram.css';

class Histogram extends React.Component {
  constructor(props) {
    super(props);

    const { auth, time } = props;


    const { getChart } = Platform;
    const { time: date, timeZone, range } = time;

    const queryBody = {
      date,
      timeZone,
      range: range
    }

    store.dispatch({ type: 'CHART_INFO', payload: axios(getChart(auth.jwtToken, queryBody)) })
  }

  componentWillMount() {
    // const { ranges } = this.props.histogram.toJS();
    // const { range, onLoad } = this.props;

    // this.onLoad = onLoad;

    // const selectedRangeIdx = ranges.indexOf(range);
    // this.props.dispatch(changeHistogramRange(selectedRangeIdx));
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    const { selectedLocation, locations, time } = this.props;
    console.debug('selectedLocation', selectedLocation, time)
    
    // const { data, aggs, fetching, ranges, selectedRangeIdx } = this.props.histogram.toJS();
    // const { date, range, location, onSelection, parentHeight, userFeatures, locale, eventFilterState = {} } = this.props;

    // const navButtonClass = classNames(
    //   'nav-button',
    //   {
    //     disabled: this._navNextDisabled(this.props.date),
    //   }
    // );

    // const dateRange = this._getDateRange();
    // const nextRange = this._determineAvailability(date, range);

    // const [language] = navigator.language.split('-');
    // numeral.locale(language);
    // numeral.defaultFormat('$0');

    // const { revenueReporting = false } = userFeatures;
    // const [symbol] = numeral(1000).format();

    // const { transaction: showTransaction } = eventFilterState;

    return (
      <div id='histogram' ref='histogram'>

      </div>
    );
  }

}

export default connect(state => {
  return {
    histogram: state.histogram,
  };
})(Histogram);