// EXTERNAL DEPENDENCIES
import React, { Component } from 'react'

// INTERNAL DEPENDENCIES
import Grid from './Grid'
import LogoutButton from '../ui/LogoutButton'

export default class ForceLogout extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      background,
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
        <label>There has been a problem, please try to log in again! </label>
        <LogoutButton />
      </Grid>
    )
  }
}

