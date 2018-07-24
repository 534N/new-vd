import React from 'react'

const styles = {
  circle: {
    cursor: 'move',
    fill: 'transparent',
    stroke: '#0088cc',
    strokeWidth: 3,
  },
  polygon: {
    fill: 'rgba(0, 136, 204, 0.5)'
  }
}

const initialPoints = [
  [ 100, 100 ],
  [ 130, 100 ],
  [ 160, 100 ],
  [ 160, 130 ],
  [ 160, 160 ],
  [ 130, 160 ],
  [ 100, 160 ],
  [ 100, 130 ],
];

class Circle extends React.Component {
  constructor(props) {
    super(props)

    const { cx, cy } = props;

    this.mouseDown = false;

    this.state = {
      cx,
      cy,
    };
  }

  componentDidMount() {
    const c = this.refs.circle;

    c.addEventListener('mousedown', this.onMouseDown.bind(this))
    c.addEventListener('mousemove', this.onMouseMove.bind(this));
    c.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  render() {
    const { r } = this.props;
    const { cx, cy } = this.state;

    return (
      <circle ref='circle' cx={cx} cy={cy} r={r} style={styles.circle} />
    )
  }

  onMouseDown() {
    this.mouseDown = true
    console.debug('mouse down')
  }

  onMouseUp() {
    this.mouseDown = false
    console.debug('mouse up')
  }

  onMouseMove({ offsetX, offsetY }) {
    if (!this.mouseDown) {
      console.debug('no more')
      return;
    }

    const { updateXY } = this.props;
    
    this.setState({
      cx: offsetX,
      cy: offsetY,
    });

    updateXY(offsetX, offsetY);
  }
}

const Polygon = ({ points, style }) => {
  const pt = points.map(p => p.join(',')).join(' ');

  return (
    <polygon points={pt} style={style} />
  )
}

class Editor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      points: initialPoints,
    };
  }

  render() {
    const { points } = this.state;

    return (
      <svg width='100%' height='100%'>
        {
          points.map(([x, y], idx) => <Circle key={`${x}-${y}`} cx={x} cy={y} r={10} updateXY={this._updatePoint.bind(this, idx)}/>)
        }
        <Polygon points={points} style={styles.polygon} />
      </svg>
    )
  }

  _updatePoint(idx, x, y) {
    const { points } = this.state;

    points[idx] = [ x, y ];

    this.setState({
      points
    })
  }
}

const getPt = (r, evt) =>  {
  // const r = this.svgRef.current.getBoundingClientRect()
  return [
    (evt.clientX - r.left) * 100 / r.width,
    (evt.clientY - r.top) * 100 / r.height,
  ]
}

export default Editor