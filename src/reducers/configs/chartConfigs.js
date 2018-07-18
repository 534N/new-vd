const top3Config = (name, description, yAxisLabel, series) => ({
  chart: {
    type: 'spline'
  },
  title: {
    text: name
  },
  subtitle: {
    text: description
  },
  xAxis: {
    type: 'datetime',
    labels: {
      overflow: 'justify'
    }
  },
  yAxis: {
    title: {
      text: yAxisLabel
    },
    labels: {
      formatter: () => '$' + this.value
    }
  },
  tooltip: {
    crosshairs: true,
    shared: true
  },
  plotOptions: {
    spline: {
      lineWidth: 4,
      states: {
        hover: {
          lineWidth: 5
        }
      },
      marker: {
        enabled: false
      },
    }
  },
  series,
})

const void5Config = (name, description, yAxisLabel, series) => ({
  chart: {
    type: 'column'
  },
  title: {
    text: name
  },
  subtitle: {
    text: description
  },
  xAxis: {
    type: 'datetime',
    crosshair: true
  },
  yAxis: {
    min: 0,
    title: {
      text: yAxisLabel
    }
  },
  tooltip: {
    shared: true,
    useHTML: true
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0
    }
  },
  series,
})

module.exports = {
  top3Config,
  void5Config
}
