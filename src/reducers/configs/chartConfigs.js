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
      formatter: function() {
        return '$' + this.value;
      } 
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
  // chart: {
  //   type: 'spline'
  // },
  chart: {
    zoomType: 'xy'
  },
  title: {
    text: name
  },
  subtitle: {
    text: description
  },
  xAxis: [{
    type: 'datetime',
    labels: {
      overflow: 'justify'
    }
  }],
  yAxis: [
    {
      title: {
        text: yAxisLabel
      },
      labels: {
        formatter: function() {
          return '$' + this.value;
        }
      }
    },
    {
      title: {
        text: 'Count'
      },
      opposite: true
    },

  ],
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

module.exports = {
  top3Config,
  void5Config
}
