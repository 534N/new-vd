import React from 'react'

const styles = {
  circle: {
    cursor: '-webkit-grab',
    fill: '#0088cc',
  },
}

class Circle extends React.Component {
    constructor(props) {
      super(props)
    }
  
    render() {
      const { id, active, cx, cy } = this.props;

      return (
        <circle id={id} ref='circle' cx={cx} cy={cy} r={8} style={{...styles.circle, cursor: active ? '-webkit-grabbing' : '-webkit-grab'}} />
      )
    }
  }

  export default Circle;