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


const rtTransactions = (series) => {
        console.debug('>>> ', series)

  return({
  chart: {
    zoomType: 'x',
    height: 100,
    backgroundColor: '#4E4E51',
  },
  xAxis: {
    type: 'datetime',
    visible: false,
  },
  yAxis: {
    visible: false,
  },
  title: {
    text: ''
  },
  legend: {
    enabled: false
  },
  plotOptions: {
    area: {
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },
        stops: [
          [0, 'rgba(13, 190, 187, 0.5)'],
          [1, 'rgba(78, 78, 81, 0)']
        ]
      },
      marker: {
        radius: 2
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1
        }
      },
      threshold: null
    },
    series: {
      animation: false,
      lineWidth: 1,
    }
  },
  series: [{
    type: 'area',
    color: 'rgba(13, 190, 187, 0.6)',
    data: series
  }]

})
}

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
