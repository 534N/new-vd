import React from 'react'
import { connect } from 'react-redux'
import { store } from '../store'
import Circle from './Circle'
/* Feature detection */
let passiveSupported = false;

try {
  window.addEventListener('test', null, Object.defineProperty({}, 'passive', { get: function() { passiveSupported = true; } }));
} catch(err) {}

const styles = {
  polygon: {
    fill: 'rgba(0, 136, 204, 0.5)',
    cursor: 'move'
  }
}

const initPosition = [ 200, 200 ];

const generatePoints = (pos, width, height) => {
  const [ x, y ] = pos;

  const x0 = x - width / 2;
  const x1 = x;
  const x2 = x + width / 2;

  const y0 = y - height / 2;
  const y1 = y;
  const y2 = y + height / 2;

  return [
    [ x0, y0 ],
    [ x1, y0 ],
    [ x2, y0 ],
    [ x2, y1 ],
    [ x2, y2 ],
    [ x1, y2 ],
    [ x0, y2 ],
    [ x0, y1 ],
  ]
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
      points: generatePoints(initPosition, 200, 200),
      active: null,
    };
  }

  componentDidMount() {
    const p = this.refs.pEditor;

    p.addEventListener('mousedown', this._onMouseDown, passiveSupported ? {passive: true} : false )
    p.addEventListener('mousemove', this._onMouseMove, passiveSupported ? {passive: true} : false );
    p.addEventListener('mouseup', this._onMouseUp, passiveSupported ? {passive: true} : false );
  }

  componentWillUnmount() {
    const p = this.refs.pEditor;

    p.removeEventListener('mousedown', this._onMouseDown)
    p.removeEventListener('mousemove', this._onMouseMove);
    p.removeEventListener('mouseup', this._onMouseUp);
  }

  render() {
    const { points, active } = this.state;

    return (
      <svg ref='pEditor' width='100%' height='100%'>
        {
          points.map(([x, y], idx) => <Circle key={`${idx}`} id={idx} cx={x} cy={y} idx={idx} active={active === idx} />)
        }
        <Polygon points={points} style={styles.polygon} />
      </svg>
    )
  }

  _onMouseDown = e => {
    const { target } = e;
    const { nodeName, id } = target;

    if (nodeName === 'circle') {
      this.setState({
        active: parseInt(id),
      })
    } else if (nodeName === 'polygon') {
      this.setState({
        active: 'all',
      })
    }
  }

  _onMouseUp = () => {
    this.setState({
      active: null,
    })
  }

  _onMouseMove = ({ offsetX, offsetY }) => {
    const { active, points } = this.state;

    if (!active) {
      return;
    }

    if (active === 'all') {
      const newPoints = points.map(([ x, y ]) => [ offsetX - x, offsetY - y])

      console.debug('newpoints', newPoints)
      this.setState({
        points: newPoints
      })

    } else {
      points[active] = [ offsetX, offsetY ];
      
      this.setState({
        points
      })
    }

    

    
  }
}




const getPt = (r, evt) =>  {
  // const r = this.svgRef.current.getBoundingClientRect()
  return [
    (evt.clientX - r.left) * 100 / r.width,
    (evt.clientY - r.top) * 100 / r.height,
  ]
}


export default Editor;
// export default connect(state => {
//   return {
//     polygon: state.polygon,
//   };
// })(Editor);