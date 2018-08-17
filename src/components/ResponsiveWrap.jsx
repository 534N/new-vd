import React from 'react'

export default ChartComponent => (
  class ResponsiveChart extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        containerWidth: null,
      }
    }

    componentDidMount() {
      this.fitParentContainer()
      window.addEventListener('resize', this.fitParentContainer)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.fitParentContainer)
    }

    render() {
      const { containerWidth } = this.state
      const shouldRenderChart = containerWidth !== null

      return (
        <div
          style={this.props.style} 
          ref={(el) => { this.chartContainer = el }}>
          {shouldRenderChart && this.renderChart()}
        </div>
      )
    }

    fitParentContainer = () => {
      const { containerWidth } = this.state
      const currentContainerWidth = this.chartContainer.getBoundingClientRect().width

      const shouldResize = containerWidth !== currentContainerWidth
      if (shouldResize) {
        this.setState({
          containerWidth: currentContainerWidth,
        })
      }
    }

    renderChart = () => {
      const parentWidth = this.state.containerWidth ;
      return (
        <ChartComponent {...this.props} parentWidth={parentWidth} />
      )
    }
  }
)