import React from 'react'
import Flex from '../components/Flex'
import IconText from '../components/IconText'
import callhome from '../api/Callhome';
 
import axios from 'axios'
import { store } from '../store'
import Circle from './Circle'

/* Feature detection */
let passiveSupported = false;

try {
  window.addEventListener('test', null, Object.defineProperty({}, 'passive', { get: function() { passiveSupported = true; } }));
} catch(err) {}

const styles = {
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  svgMarker: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  },
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

class Control extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      label: '',
    }

  }

  render() {
    const { label, editMode } = this.state;
    return (
      <Flex id='polygonEditorControl' alignItems='center' justifyContent='center' width='100%' position='absolute' style={{position: 'absolute', background: '#000', bottom: 0, padding: '10px'}}>
        {
          editMode &&
          <div>
            <input value={label} onChange={this._onUpdateLabel} />
            <button onClick={this._saveData} >Save</button>
            <button onClick={() => { this.setState({ editMode: false}) } }>Cancel</button>
          </div>
        }
        {
          !editMode &&
          <div>
            <div onClick={this._addPolygon}><IconText path='format_shapes' fill='#fff' text={'Create Zone'} labelStyle={{ color: '#fff' }} style={{ width: 'auto' }} /></div>
            <div onClick={this._addMarker}><IconText path='add_location' fill='#fff' text={'Add Mark'} labelStyle={{ color: '#fff' }} style={{ width: 'auto' }} /></div>
          </div>
        }
        
      </Flex>
    )
  }

  _saveData = () => {
    const { saveData } = this.props;
    saveData();
  }

  _onUpdateLabel = e => {
    const { updateLabel } = this.props;

    this.setState({ label: e.target.value })
    updateLabel(e.target.value);
  }

  _addPolygon = () => {
    const { addPolygon } = this.props;

    this.setState({
      editMode: true
    });
    addPolygon();
  }

  _addMarker = () => {
    const { addMarker } = this.props;

    this.setState({
      editMode: true
    });
    addMarker();
  }
}

const Polygon = ({ points, style }) => {
  const pt = points.map(p => p.join(',')).join(' ');

  return (
    <polygon points={pt} style={style} />
  )
}

const Pin = ({ data, label, category }) => {

  const iconDim = 36
  const x = data[0] - (iconDim / 2)
  const y = data[1] - iconDim

  return (
    <svg viewBox='0 0 200 200' x={x} y={y} width={200} height={200} fill={'#fff'}>
      <path d="M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M7,9c0-2.76,2.24-5,5-5s5,2.24,5,5 c0,2.88-2.88,7.19-5,9.88C9.92,16.21,7,11.85,7,9z"/><circle cx="12" cy="9" r="2.5" fill='#f54'/>
      <text width={200} height={30} style={{ fontSize: '14px', transform: `translate(0px, 40px)` }}>{label}</text>
    </svg>
  )
}

class PolygonEditor extends React.Component {
  constructor(props) {
    super(props)

    this.svgRef = React.createRef();
    this.state = {
      marker: [-10, -10],
      points: generatePoints(initPosition, 200, 200),
      active: null,
      polygonEdit: false,
    };
  }

  render() {
    const { points, active, polygonEdit, markerEdit, marker, label } = this.state;

    return (
      <Flex alignItems='center' justifyContent='center' width='100%' height='100%' position='absolute'>
        {
          polygonEdit &&
          <svg ref={this.svgRef}
            style={styles.svg}
            width='100%'
            height='100%'
            onMouseDown={this._onMouseDown}
            onMouseMove={this._onMouseMove}
            onMouseUp={this._onMouseUp}>
            {
              points.map(([x, y], idx) => <Circle key={`${idx}`} id={idx} cx={x} cy={y} idx={idx} active={active === idx} />)
            }
            <Polygon points={points} style={styles.polygon} />
          </svg>
        }
        {
          markerEdit &&
          <svg ref={this.svgRef}
            style={styles.svgMarker}
            width='100%'
            height='100%'
            onClick={this._onClick}>
            <Pin data={ marker } label={label} />
          </svg>
        }
        <Control
          addPolygon={() => this.setState({ polygonEdit: true })}
          addMarker={() => this.setState({ markerEdit: true })}
          updateLabel={label => this.setState({ label })}
          saveData={this._saveData} />

      </Flex>
    )
  }

  _saveData = () => {
    const { jwtToken, cameraId } = this.props;
    const { polygonEdit, markerEdit, points, marker, label } = this.state;
    const { annotations } = callhome;

    if (polygonEdit) {

    } else if (markerEdit) {
      const normalizedCoord = this._getCoord(marker);

      const data = {
        annotations: {
          tables: [
            {
              label,
              points: [ normalizedCoord ]
            }
          ]
        }
      }
      
      store.dispatch({ type: 'ADD_ANNOTATION', payload: axios(annotations(jwtToken, cameraId, data))})
    }
  }

  _onClick = e => {
    const t = this._getAbsoluteCoord(e);
    console.debug(t)
    this.setState({
      marker: this._getAbsoluteCoord(e),
    })
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
      });

      this.polygonOldCoord = this._getAbsoluteCoord(e);
      this.pointsOld = this.state.points;
    }
  }

  _onMouseUp = () => {
    this.setState({
      active: null,
    })
  }

  _onMouseMove = (e) => {
    const { active, points } = this.state;

    if (!active) {
      return;
    }    

    if (active === 'all') {
      const [ lat, lon ] = this._getAbsoluteCoord(e);
      const [ oldLat, oldLon ] = this.polygonOldCoord;
      const offsetX = oldLat - lat;
      const offsetY = oldLon - lon;

      const newPoints = this.pointsOld.map(([ x, y ]) => [ x - offsetX, y - offsetY ])

      this.setState({
        points: newPoints
      })

    } else {
      points[active] = this._getAbsoluteCoord(e);
      
      this.setState({
        points
      })
    }
  }

  _getAbsoluteCoord = evt => {
    const r = this.svgRef.current.getBoundingClientRect()
    return [
      evt.clientX - r.left,
      evt.clientY - r.top,
    ]
  }

  _getCoord = ([ x, y ]) => {
    const r = this.svgRef.current.getBoundingClientRect()
    return [
      (x - r.left) * 100 / r.width,
      (y - r.top) * 100 / r.height,
    ]
  }

}

export default PolygonEditor;