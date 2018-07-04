// EXTERNAL DEPENDENCIES
import React, { Component } from 'react'

// INTERNAL DEPENDENCIES
import Grid from './Grid'

export default class Mask extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      background,
      loading=true,
      onClickAction,
      position,
      top,
      text
    } = this.props

    return (
      <Grid
        onClick={onClickAction}
        height='100%'
        position={ position || `fixed`}
        justifyContent='center'
        alignContent='center'
        background={background || 'rgba(255,255,255,0.6)'}
        zIndex={10000}
        style={{
          top: top || 'auto',
          left: 0
        }} >
        { 
          loading && <img src={require('../svg/loading-cylon.svg')} />
        }
        { text && <label style={{fontSize: `14px`}}>{text}</label> }
      </Grid>
    )
  }
}

