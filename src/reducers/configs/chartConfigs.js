const style = {
  title: {
    color: '#888',
    fontWeight: 100,
    fontSize: '15px',
  }
}

const responsive = {
  rules: [{
    condition: {
      maxWidth: 500
    },
    chartOptions: {
      chart: {
        height: 300,
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal'
      },
      yAxis: {
        labels: {
          align: 'left',
          x: 0,
          y: -5
        },
        title: {
          text: null
        }
      },
      subtitle: {
        text: null
      },
      credits: {
        enabled: false
      }
    }
  }]
}


const rtTransactions = (name, description, yAxisLabel, series) => ({
  chart: {
    type: 'scatter',
    margin: [70, 50, 60, 80],
    events: {
      click: function (e) {
        // find the clicked values and the series
        var x = Math.round(e.xAxis[0].value),
          y = Math.round(e.yAxis[0].value),
          series = this.series[0];

        // Add it
        series.addPoint([x, y]);

      }
    }
  },
  title: {
    text: 'User supplied data'
  },
  subtitle: {
    text: 'Click the plot area to add a point. Click a point to remove it.'
  },
  xAxis: {
    gridLineWidth: 1,
    minPadding: 0.2,
    maxPadding: 0.2,
    maxZoom: 60
  },
  yAxis: {
    title: {
      text: 'Value'
    },
    minPadding: 0.2,
    maxPadding: 0.2,
    maxZoom: 60,
    plotLines: [{
      value: 0,
      width: 1,
      color: '#808080'
    }]
  },
  legend: {
    enabled: false
  },
  exporting: {
    enabled: false
  },
  plotOptions: {
    series: {
      lineWidth: 1,
      point: {
        events: {
          'click': function () {
            if (this.series.data.length > 1) {
              this.remove();
            }
          }
        }
      }
    }
  },
  series: [{
    data: [
      [20, 20],
      [80, 80]
    ]
  }]

})

const top3Config = (name, description, yAxisLabel, series) => ({
  chart: {
    type: 'spline'
  },
  title: {
    text: name,
    style: style.title,    
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
    },
    visible: false,
  },
  tooltip: {
    crosshairs: true,
    shared: true
  },
  legend: {
    enabled: false,
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
  responsive,
})

const void5Config = (name, description, yAxisLabel, series) => ({
  // chart: {
  //   type: 'spline'
  // },
  chart: {
    zoomType: 'xy'
  },
  title: {
    text: name,
    style: style.title,
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
      },
      visible: false,
    },
    {
      title: {
        text: 'Count'
      },
      opposite: true,
      visible: false,
    },

  ],
  legend: {
    enabled: false,
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
  responsive,
})

const spiderWebConfig = (name, description, yAxisLabel, series) => ({
  chart: {
    polar: true,
    type: 'line'
  },

  title: {
    text: 'Budget vs spending',
    style: style.title,
  },

  pane: {
    size: '80%'
  },

  xAxis: {
    categories: ['Sales', 'Marketing', 'Development', 'Customer Support',
      'Information Technology', 'Administration'
    ],
    tickmarkPlacement: 'on',
    lineWidth: 0
  },

  yAxis: {
    gridLineInterpolation: 'polygon',
    lineWidth: 0,
    min: 0
  },

  tooltip: {
    shared: true,
    pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
  },

  legend: {
    align: 'right',
    verticalAlign: 'top',
    y: 70,
    layout: 'vertical',
    enabled: false,
  },

  series: [{
    name: 'Allocated Budget',
    data: [43000, 19000, 60000, 35000, 17000, 10000],
    pointPlacement: 'on'
  }, {
    name: 'Actual Spending',
    data: [50000, 39000, 42000, 31000, 26000, 14000],
    pointPlacement: 'on'
  }],
  responsive
})

module.exports = {
  rtTransactions,
  top3Config,
  void5Config,
  spiderWebConfig,
}
